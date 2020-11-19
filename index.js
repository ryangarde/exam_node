const data = require("./data.json");
const http = require("http");
const express = require("express");
const router = express.Router();
const app = express();

router.get("/", (req, res, next) => {
  let average = 0;
  let total = 0;
  let filteredData = [];
  let sites = [];
  let queries = ["date", "date_from", "date_to"];

  let some = Object.keys(req.query).some((query) => {
    return !queries.includes(query) || !Date.parse(req.query[query]);
  });
  if (some) return res.status(500).send("Invalid query/date format");

  filteredData = data.filter((item) => {
    if (req.query.date_from && req.query.date_to) {
      if (req.query.date_from < item.date && req.query.date_to > item.date) updateData(item);
      return req.query.date_from < item.date && req.query.date_to > item.date;
    } else if (req.query.date_from) {
      if (req.query.date_from < item.date) updateData(item);
      return req.query.date_from < item.date;
    } else if (req.query.date_to) {
      if (req.query.date_to > item.date) updateData(item);
      return req.query.date_to > item.date;
    } else if (req.query.date) {
      if (item.date.includes(req.query.date)) updateData(item);
      return item.date.includes(req.query.date);
    } else {
      updateData();
      return item;
    }
  });

  function updateData(item) {
    sites.push({ [item.date]: item.domain });
    total += item.visitors;
  }

  average = total / filteredData.length;

  res.send({ average_site_visits: data });
});

app.use(router);

app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

const server = http.createServer(app);
server.listen(3000);

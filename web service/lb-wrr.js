import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());
const port = 8080;

app.get("/", (req, res) => {
  res.json("LB");
});

const servers = [
  "http://localhost:3000", //w=3
  "http://localhost:3001", //w=2
  "http://localhost:3002", //w=1
];
let count = 1;
app.all("*", async (req, res) => {
  let path = req.originalUrl;
  let method = req.method;
  let headers = {
    "content-type": "application/json",
  };
  let body = req.body;
  if (count % 6 == 1 || count % 6 == 4 || count % 6 == 0) {
    try {
      const response = await axios({
        url: `${servers[0]}${path}`,
        method: method,
        headers: headers,
        data: body,
      });
      count += 1;
      res.send(response.data);
    } catch (err) {
      res.status(err.status).send(err);
    }
  } else if (count % 6 == 2 || count % 6 == 5) {
    try {
      const response = await axios({
        url: `${servers[1]}${path}`,
        method: method,
        headers: headers,
        data: body,
      });
      count += 1;
      res.send(response.data);
    } catch (err) {
      res.status(err.status).send(err);
    }
  } else if (count % 6 == 3) {
    try {
      const response = await axios({
        url: `${servers[2]}${path}`,
        method: method,
        headers: headers,
        data: body,
      });
      count += 1;
      res.send(response.data);
    } catch (err) {
      res.status(err.status).send(err);
    }
  }
});

app.listen(port, () => {
  console.log("Servis radi!");
});

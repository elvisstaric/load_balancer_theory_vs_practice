import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());
const port = 8080;

app.get("/", (req, res) => {
  res.json("LB");
});

const servers = [
  { ip: "http://localhost:3000", conns: 0 },
  { ip: "http://localhost:3001", conns: 0 },
  { ip: "http://localhost:3002", conns: 0 },
];

app.all("*", async (req, res) => {
  let path = req.originalUrl;
  let method = req.method;
  let headers = {
    "content-type": "application/json",
  };
  let body = req.body;
  var min = servers[0];
  try {
    for (let server of servers) {
      if (server["conns"] <= min) {
        min = server;
      }
    }
    min["conns"] += 1;
    const response = await axios({
      url: `${min["ip"]}${path}`,
      method: method,
      headers: headers,
      data: body,
    });
    min["conns"] -= 1;
    res.send(response.data);
  } catch (err) {
    res.status(err.status).send(err);
  }
});

app.listen(port, () => {
  console.log("Servis radi!");
});

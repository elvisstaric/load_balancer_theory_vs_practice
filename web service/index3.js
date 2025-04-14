import express from "express";
import router from "./routes/proizvodi.js";
const app = express();
app.use(express.json());
app.use("/proizvodi", router);
const port = 3002;

app.get("/pozdrav", (req, res) => {
  res.json("Pozdrav3");
});

app.listen(port, () => {
  console.log("Servis radi!");
});

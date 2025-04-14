import express from "express";
import fs from "node:fs/promises";
const router = express.Router();
router.use(express.json());

async function getData() {
  let data_proizvodi = fs.readFile("././data.json", (err, cont) => {
    if (err) throw err;
  });
  return data_proizvodi;
}
let data = JSON.parse(await getData());

async function postData(data_proizvodi) {
  data = data_proizvodi;
}

router.get("/", (req, res) => {
  let marka = req.query.marka;
  if (marka) {
    let filtrirano = data.filter((el) => el.marka == marka);
    res.status(200).json(filtrirano);
  } else res.status(200).json(data);
});

router.post("/", (req, res) => {
  let marka = req.body.marka;
  let model = req.body.model;
  let zaliha = req.body.zaliha;
  let ocjena = req.body.ocjena;
  let list_id = [];
  data.forEach((proizvod) => {
    list_id.push(proizvod.id);
  });
  list_id.sort((a, b) => a - b);
  let new_id = list_id[list_id.length - 1] + 1;

  if (marka && model && zaliha && ocjena) {
    data.push({
      id: new_id,
      marka: marka,
      model: model,
      zaliha: zaliha,
      ocjena: ocjena,
    });
    postData(data);
    res.status(201).json("Zapisano");
  } else {
    let nedostaje = [];
    if (marka == null) nedostaje.push("Marka");
    if (model == null) nedostaje.push("Model");
    if (zaliha == null) nedostaje.push("Zaliha");
    if (ocjena == null) nedostaje.push("Ocjena");

    res.status(400).json("Nedostaju atributi: " + nedostaje);
  }
});

router.get("/:id", (req, res) => {
  let trazeni_id = req.params.id;
  let trazeni_pr = data.filter((element) => element.id == trazeni_id);
  let message = "pronaden proizvod sa id " + trazeni_id;
  if (trazeni_pr[0]) res.status(200).json({ message: message, trazeni_pr });
  else res.status(404).json("Trazeni proizvod ne postoji!");
});

router.patch("/:id", (req, res) => {
  let id = req.params.id;
  let zaliha_promjena = req.body.zaliha;
  let pronadeno;
  data.forEach((proizvod) => {
    if (proizvod.id == id) {
      pronadeno = true;
      if (proizvod.zaliha + zaliha_promjena < 0) {
        res.status(400).json("Nedovoljna zaliha!");
        throw "stop";
      } else proizvod.zaliha += zaliha_promjena;
    }
  });
  if (pronadeno) {
    postData(data);
    res.status(201).json("Zaliha promjenjena");
  } else res.status(404).json("Trazeni proizvod ne postoji!");
});

router.delete("/:id", (req, res) => {
  let id = req.params.id;
  let trazeno = false;
  data.forEach((proizvod) => {
    if (proizvod.id == id) {
      trazeno = true;
      data.splice(data.indexOf(proizvod), 1);
      postData(data);
    }
  });
  if (trazeno) res.status(204).send();
  else res.status(204).json("Trazeni proizvod ne postoji!");
});

export default router;

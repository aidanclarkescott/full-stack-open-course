import express from "express";
import patientService from "../services/patientService";
import { Entry } from "../types";
import { toNewPatient, toNewEntry } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getEntries());
});

router.get("/:id", (req, res) => {
  const patient = patientService.getPatient(req.params.id);

  if (!patient) {
    res.status(404).send({ error: "Patient not found" });
  }

  res.json(patient);
});

router.post("/", (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);

    const addedEntry = patientService.addPatient(newPatient);
    res.json(addedEntry);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/:id/entries", (req, res) => {
  try {
    const newEntry = toNewEntry(req.body);

    const addedEntry: Entry = patientService.addEntry(req.params.id, newEntry);
    res.json(addedEntry);
  } catch (e) {
    res.status(400).send({ error: "unable to add entry: " + e.message });
  }
});

export default router;

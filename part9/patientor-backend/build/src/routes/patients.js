"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patientService_1 = __importDefault(require("../services/patientService"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.get("/", (_req, res) => {
    res.send(patientService_1.default.getEntries());
});
router.get("/:id", (req, res) => {
    const patient = patientService_1.default.getPatient(req.params.id);
    if (!patient) {
        res.status(404).send({ error: "Patient not found" });
    }
    res.json(patient);
});
router.post("/", (req, res) => {
    try {
        const newPatient = utils_1.toNewPatient(req.body);
        const addedEntry = patientService_1.default.addPatient(newPatient);
        res.json(addedEntry);
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});
router.post("/:id/entries", (req, res) => {
    try {
        const newEntry = utils_1.toNewEntry(req.body);
        const addedEntry = patientService_1.default.addEntry(req.params.id, newEntry);
        res.json(addedEntry);
    }
    catch (e) {
        res.status(400).send({ error: "unable to add entry: " + e.message });
    }
});
exports.default = router;

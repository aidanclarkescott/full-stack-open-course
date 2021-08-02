"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../../data/patients"));
const uuid_1 = require("uuid");
const utils_1 = require("../utils");
const getEntries = () => {
    return patients_1.default.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};
const getPatient = (patientId) => {
    return patients_1.default.find((patient) => patient.id === patientId);
};
const addPatient = (entry) => {
    const newPatient = Object.assign({ id: utils_1.parseString(uuid_1.v1()) }, entry);
    patients_1.default.push(newPatient);
    return newPatient;
};
const addEntry = (id, entry) => {
    const newEntry = Object.assign({ id: utils_1.parseString(uuid_1.v1()) }, entry);
    const patient = patients_1.default.find((patient) => patient.id === id);
    if (!patient) {
        throw new Error("Could not find patient");
    }
    patient.entries.push(newEntry);
    return newEntry;
};
exports.default = {
    getEntries,
    addPatient,
    getPatient,
    addEntry,
};

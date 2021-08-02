import patients from "../../data/patients";
import { v1 as uuid } from "uuid";
import { parseString } from "../utils";
import { PublicPatient, NewPatient, Patient, NewEntry, Entry } from "../types";

const getEntries = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatient = (patientId: string): Patient | undefined => {
  return patients.find((patient) => patient.id === patientId);
};

const addPatient = (entry: NewPatient) => {
  const newPatient = {
    id: parseString(uuid()),
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: NewEntry): Entry => {
  const newEntry = {
    id: parseString(uuid()),
    ...entry,
  };

  const patient = patients.find((patient) => patient.id === id);

  if (!patient) {
    throw new Error("Could not find patient");
  }

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getEntries,
  addPatient,
  getPatient,
  addEntry,
};

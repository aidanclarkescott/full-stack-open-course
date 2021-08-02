import { NewPatient, Gender, NewEntry, HealthCheckRating } from "./types";

type Fields = {
  name: unknown;
  dateOfBirth: unknown;
  ssn: unknown;
  gender: unknown;
  occupation: unknown;
};

const toNewPatient = ({
  name,
  dateOfBirth,
  ssn,
  gender,
  occupation,
}: Fields): NewPatient => {
  const newEntry: NewPatient = {
    name: parseString(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseString(ssn),
    gender: parseGender(gender),
    occupation: parseString(occupation),
    entries: [],
  };

  return newEntry;
};

const toNewEntry = (entry: NewEntry): NewEntry => {
  switch (entry.type) {
    case "HealthCheck":
      const newHealthCheckEntry: NewEntry = {
        description: parseString(entry.description),
        date: parseDate(entry.date),
        specialist: parseString(entry.specialist),
        diagnosisCodes: entry.diagnosisCodes,
        type: entry.type,
        healthCheckRating: parseHealthCheckRating(entry.healthCheckRating),
      };

      return newHealthCheckEntry;
    case "OccupationalHealthcare":
      const newOccupationalHealthcareEntry: NewEntry = {
        description: parseString(entry.description),
        date: parseDate(entry.date),
        specialist: parseString(entry.specialist),
        diagnosisCodes: entry.diagnosisCodes,
        type: entry.type,
        employerName: parseString(entry.employerName),
        sickLeave: entry.sickLeave,
      };

      return newOccupationalHealthcareEntry;
    case "Hospital":
      const newHospitalEntry: NewEntry = {
        description: parseString(entry.description),
        date: parseDate(entry.date),
        specialist: parseString(entry.specialist),
        diagnosisCodes: entry.diagnosisCodes,
        type: entry.type,
        discharge: {
          date: parseString(entry.discharge.date),
          criteria: parseString(entry.discharge.criteria),
        },
      };

      return newHospitalEntry;

    default:
      return assertNever(entry);
  }
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export const parseString = (text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error("Incorrect or missing text");
  }

  return text;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

const parseHealthCheckRating = (
  healthCheckRating: unknown
): HealthCheckRating => {
  if (
    healthCheckRating === undefined ||
    !isHealthCheckRating(healthCheckRating)
  ) {
    throw new Error(
      "Incorrect or missing healthCheckRating: " + healthCheckRating
    );
  }

  return healthCheckRating;
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

export { toNewPatient, toNewEntry };

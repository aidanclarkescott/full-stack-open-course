"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewEntry = exports.toNewPatient = exports.parseString = void 0;
const types_1 = require("./types");
const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation, }) => {
    const newEntry = {
        name: exports.parseString(name),
        dateOfBirth: parseDate(dateOfBirth),
        ssn: exports.parseString(ssn),
        gender: parseGender(gender),
        occupation: exports.parseString(occupation),
        entries: [],
    };
    return newEntry;
};
exports.toNewPatient = toNewPatient;
const toNewEntry = (entry) => {
    switch (entry.type) {
        case "HealthCheck":
            const newHealthCheckEntry = {
                description: exports.parseString(entry.description),
                date: parseDate(entry.date),
                specialist: exports.parseString(entry.specialist),
                diagnosisCodes: entry.diagnosisCodes,
                type: entry.type,
                healthCheckRating: parseHealthCheckRating(entry.healthCheckRating),
            };
            return newHealthCheckEntry;
        case "OccupationalHealthcare":
            const newOccupationalHealthcareEntry = {
                description: exports.parseString(entry.description),
                date: parseDate(entry.date),
                specialist: exports.parseString(entry.specialist),
                diagnosisCodes: entry.diagnosisCodes,
                type: entry.type,
                employerName: exports.parseString(entry.employerName),
                sickLeave: entry.sickLeave,
            };
            return newOccupationalHealthcareEntry;
        case "Hospital":
            const newHospitalEntry = {
                description: exports.parseString(entry.description),
                date: parseDate(entry.date),
                specialist: exports.parseString(entry.specialist),
                diagnosisCodes: entry.diagnosisCodes,
                type: entry.type,
                discharge: {
                    date: exports.parseString(entry.discharge.date),
                    criteria: exports.parseString(entry.discharge.criteria),
                },
            };
            return newHospitalEntry;
        default:
            return assertNever(entry);
    }
};
exports.toNewEntry = toNewEntry;
const assertNever = (value) => {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};
const parseString = (text) => {
    if (!text || !isString(text)) {
        throw new Error("Incorrect or missing text");
    }
    return text;
};
exports.parseString = parseString;
const parseDate = (date) => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error("Incorrect or missing date: " + date);
    }
    return date;
};
const parseGender = (gender) => {
    if (!gender || !isGender(gender)) {
        throw new Error("Incorrect or missing gender: " + gender);
    }
    return gender;
};
const parseHealthCheckRating = (healthCheckRating) => {
    if (healthCheckRating === undefined ||
        !isHealthCheckRating(healthCheckRating)) {
        throw new Error("Incorrect or missing healthCheckRating: " + healthCheckRating);
    }
    return healthCheckRating;
};
const isString = (text) => {
    return typeof text === "string" || text instanceof String;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param) => {
    return Object.values(types_1.Gender).includes(param);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param) => {
    return Object.values(types_1.HealthCheckRating).includes(param);
};

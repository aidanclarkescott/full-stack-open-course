import React from "react";
import { Header, Icon } from "semantic-ui-react";
import {
  Diagnosis,
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthCareEntry,
} from "../types";

const Hospital = ({
  entry,
  diagnoses,
}: {
  entry: HospitalEntry;
  diagnoses: { [code: string]: Diagnosis };
}) => {
  return (
    <div className="ui fluid card">
      <div className="content">
        <Header as="h2">
          {entry.date} <Icon name="hospital" />
        </Header>
        <p>{entry.description}</p>
        <p>discharge date: {entry.discharge.date}</p>
        <p>discharge criteria: {entry.discharge.criteria}</p>
        <ul>
          {entry.diagnosisCodes &&
            entry.diagnosisCodes.map((diagnosis) => (
              <li key={diagnosis}>
                {diagnosis} {diagnoses[diagnosis].name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

const OccupationalHealthcare = ({
  entry,
  diagnoses,
}: {
  entry: OccupationalHealthCareEntry;
  diagnoses: { [code: string]: Diagnosis };
}) => {
  return (
    <div className="ui fluid card">
      <div className="content">
        <Header as="h2">
          {entry.date} <Icon name="stethoscope" /> {entry.employerName}
        </Header>
        <p>{entry.description}</p>

        {entry.sickLeave && (
          <p>
            sick leave: {entry.sickLeave?.startDate} to{" "}
            {entry.sickLeave?.endDate}
          </p>
        )}

        <ul>
          {entry.diagnosisCodes &&
            entry.diagnosisCodes.map((diagnosis) => (
              <li key={diagnosis}>
                {diagnosis} {diagnoses[diagnosis].name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

const HealthCheck = ({
  entry,
  diagnoses,
}: {
  entry: HealthCheckEntry;
  diagnoses: { [code: string]: Diagnosis };
}) => {
  const classes: string[] = [
    "goodHealth",
    "okayHealth",
    "poorHealth",
    "terribleHealth",
  ];
  const healthRating: string = classes[entry.healthCheckRating];

  return (
    <div className="ui fluid card">
      <div className="content">
        <Header as="h2">
          {entry.date} <Icon name="user md" />
        </Header>
        <p>{entry.description}</p>
        <ul>
          {entry.diagnosisCodes &&
            entry.diagnosisCodes.map((diagnosis) => (
              <li key={diagnosis}>
                {diagnosis} {diagnoses[diagnosis].name}
              </li>
            ))}
        </ul>
        <Icon name="heart" className={healthRating} />
      </div>
    </div>
  );
};

const EntryDetails: React.FC<{
  entry: Entry;
  diagnoses: { [code: string]: Diagnosis };
}> = ({ entry, diagnoses }) => {
  switch (entry.type) {
    case "Hospital":
      return <Hospital entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcare entry={entry} diagnoses={diagnoses} />;
    case "HealthCheck":
      return <HealthCheck entry={entry} diagnoses={diagnoses} />;

    default:
      return assertNever(entry);
  }
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export default EntryDetails;

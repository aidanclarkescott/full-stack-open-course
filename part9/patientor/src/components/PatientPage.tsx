import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Header, Icon } from "semantic-ui-react";
import axios from "axios";
import { Patient, Entry, NewEntry } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { addPatient, updatePatient } from "../state/reducer";
import EntryDetails from "./EntryDetails";
import AddEntryModal from "../AddEntryModal";

const PatientPage = () => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();
  const [type, setType] = React.useState<string>("");
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  const patient = patients[id];
  const isUpdated = patient && patient.ssn !== undefined;

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );

        if (!patient) dispatch(addPatient(patient));
        else dispatch(updatePatient(patient));
      } catch (e) {
        console.error(e);
      }
    };

    if (!patient || !isUpdated) void fetchPatient();
  }, [id]);

  if (!diagnoses || !patient || !isUpdated) return <div>Loading...</div>;

  const genderIcon =
    patient.gender === "male"
      ? "mars"
      : patient.gender === "female"
      ? "venus"
      : "genderless";

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: NewEntry) => {
    try {
      mutateNewEntires(values);
      console.log(values);
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${patient.id}/entries`,
        values
      );

      const updatedPatient = {
        ...patient,
        entries: patient.entries
          ? patient.entries.concat(newEntry)
          : [newEntry],
      };

      dispatch(updatePatient(updatedPatient));
      closeModal();
    } catch (e) {
      console.error(e.response?.data || "Unknown Error");
      setError(e.response?.data?.error || "Unknown error");
    }
  };

  const mutateNewEntires = (values: NewEntry) => {
    if (
      values.type === "OccupationalHealthcare" &&
      values.startDate &&
      values.endDate
    ) {
      const startDate: string = values.startDate;
      const endDate: string = values.endDate;
      delete values.startDate;
      delete values.endDate;

      values.sickLeave = { startDate, endDate };
    } else if (
      values.type === "Hospital" &&
      values.dischargeDate &&
      values.criteria
    ) {
      const date: string = values.dischargeDate;
      const criteria: string = values.criteria;
      delete values.dischargeDate;
      delete values.criteria;

      values.discharge = { date, criteria };
    }
  };

  return (
    <div>
      <Header as="h2">
        {patient.name}
        <Icon name={genderIcon} />
      </Header>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>

      <Header as="h3">entries</Header>
      {patient.entries &&
        patient.entries.map((entry: Entry) => (
          <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
        ))}

      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
        type={type}
      />
      <Button
        onClick={() => {
          openModal();
          setType("Health Check");
        }}
      >
        Add New Health Check Entry
      </Button>
      <Button
        onClick={() => {
          openModal();
          setType("Occupational Healthcare");
        }}
      >
        Add New Occupational Healthcare Entry
      </Button>
      <Button
        onClick={() => {
          openModal();
          setType("Hospital");
        }}
      >
        Add New Hospital Entry
      </Button>
    </div>
  );
};

export default PatientPage;

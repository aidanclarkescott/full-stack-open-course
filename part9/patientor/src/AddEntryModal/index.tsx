import React from "react";
import { Modal, Segment } from "semantic-ui-react";
import { NewEntry } from "../types";
import AddHealthCheckEntryForm from "./AddHealthCheckEntryForm";
import AddHospitalEntryForm from "./AddHospitalEntry";
import AddOccupationalHealthcareEntryForm from "./AddOccupationalHealthcareEntry";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewEntry) => void;
  error?: string;
  type: string;
}

const AddEntryModal = ({
  modalOpen,
  onClose,
  onSubmit,
  error,
  type,
}: Props) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>Add a new {type} entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      {type === "Health Check" && (
        <AddHealthCheckEntryForm onSubmit={onSubmit} onCancel={onClose} />
      )}
      {type === "Occupational Healthcare" && (
        <AddOccupationalHealthcareEntryForm
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      )}
      {type === "Hospital" && (
        <AddHospitalEntryForm onSubmit={onSubmit} onCancel={onClose} />
      )}
    </Modal.Content>
  </Modal>
);

export default AddEntryModal;

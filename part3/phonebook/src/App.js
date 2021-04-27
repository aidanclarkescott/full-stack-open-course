import React, { useState, useEffect } from "react";
import personService from "./services/persons";

const Filter = ({ search, handleSearchChange }) => (
  <div>
    filter shown with <input value={search} onChange={handleSearchChange} />
  </div>
);

const PersonForm = ({
  addPerson,
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Person = ({ name, number, deletePerson }) => (
  <div>
    {name} {number} <button onClick={deletePerson}>delete</button>
  </div>
);

const Persons = ({ filteredPeople, deletePerson }) => {
  return (
    <>
      {filteredPeople.map((person) => (
        <Person
          key={person.name}
          name={person.name}
          number={person.number}
          deletePerson={() => deletePerson(person.id)}
        />
      ))}
    </>
  );
};

const Notification = ({ message, styleName }) => {
  if (message == null) return null;

  return <div className={styleName}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null);
  const [notificationStyle, setNotificationStyle] = useState("");

  useEffect(() => {
    personService.getAll().then((personList) => {
      setPersons(personList);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const person = persons.find((person) => person.name === newName);

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    if (person) {
      const replacing = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (replacing) {
        personService
          .update(person.id, newPerson)
          .then((updatedPerson) => {
            setPersons(
              persons.map((p) => (p.id !== person.id ? p : updatedPerson))
            );
          })
          .catch((error) => {
            setNotificationStyle("error");
            setNotification(
              `Information of ${person.name} has already been removed from server`
            );
            setTimeout(() => setNotification(null), 5000);
          });
      }

      setNewName("");
      setNewNumber("");
      return;
    }

    personService
      .create(newPerson)
      .then((addedPerson) => {
        setPersons(persons.concat(addedPerson));
        setNotificationStyle("notification");
        setNotification(`Added ${addedPerson.name}`);
        setTimeout(() => setNotification(null), 5000);
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        setNotificationStyle("error");
        setNotification(error.response.data.error);
        setTimeout(() => setNotification(null), 5000);
      });
  };

  const removePerson = (id) => {
    const person = persons.find((person) => person.id === id);

    if (!window.confirm(`Delete ${person.name}?`)) return;

    personService
      .remove(id)
      .then((response) => {
        setPersons(persons.filter((person) => person.id !== id));
      })
      .catch((error) => {
        setNotificationStyle("error");
        setNotification(
          `Information of ${person.name} has already been removed from server`
        );
        setTimeout(() => setNotification(null), 5000);
        setPersons(persons.filter((person) => person.id !== id));
      });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredPeople =
    search.length === 0
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} styleName={notificationStyle} />
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons filteredPeople={filteredPeople} deletePerson={removePerson} />
    </div>
  );
};

export default App;

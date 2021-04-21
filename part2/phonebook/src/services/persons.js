import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  const response = axios.get(baseUrl);
  return response.then((response) => response.data);
};

const create = (newPerson) => {
  const response = axios.post(baseUrl, newPerson);
  return response.then((response) => response.data);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const update = (id, newPerson) => {
  const response = axios.put(`${baseUrl}/${id}`, newPerson);
  return response.then((response) => response.data);
};

const personService = { getAll, create, remove, update };
export default personService;

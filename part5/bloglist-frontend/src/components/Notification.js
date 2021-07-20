import React from "react";
import { useSelector } from "react-redux";
import { Alert } from "@material-ui/lab";

const Notification = ({ type }) => {
  const message = useSelector((state) => state.notification);

  return message && <Alert severity={type}>{message}</Alert>;
};

export default Notification;

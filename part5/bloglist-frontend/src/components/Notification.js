import React from "react";
import { useSelector } from "react-redux";

const Notification = ({ cssClass }) => {
  const message = useSelector((state) => state.notification);

  return message && <div className={cssClass}>{message}</div>;
};

export default Notification;

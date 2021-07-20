import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../reducers/userReducer";
import Notification from "./Notification";
import { TextField, Button, Typography } from "@material-ui/core";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();

    dispatch(loginUser({ username, password }));
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <Typography variant="h4">Login</Typography>
      <br />
      <Notification type="error" />
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <br />
        <Button variant="contained" color="primary" type="submit">
          login
        </Button>
      </form>
    </>
  );
};

export default LoginForm;

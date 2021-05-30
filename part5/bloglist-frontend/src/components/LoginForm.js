import React, { useState } from "react";
import Notification from "./Notification";
import blogService from "../services/blogs";
import loginService from "../services/login";

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      setUsername("");
      setPassword("");
      window.localStorage.setItem("currentBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      console.log("error", exception);
      setNotificationMessage("Wrong username or password");
      setTimeout(() => setNotificationMessage(null), 5000);
    }
  };

  return (
    <>
      <h2>log in to application</h2>
      <Notification message={notificationMessage} cssClass="error" />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );
};

export default LoginForm;

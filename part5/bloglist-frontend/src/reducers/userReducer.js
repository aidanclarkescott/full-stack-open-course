import loginService from "../services/login";
import blogService from "../services/blogs";
import { setNotification } from "./notificationReducer";

const userReducer = (state = null, action) => {
  switch (action.type) {
    case "CHANGE_USER":
      return action.user;
    default:
      return state;
  }
};

export const setUser = (user) => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_USER", user });
    blogService.setToken(user.token);
  };
};

export const loginUser = (credentials) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(credentials);
      dispatch({ type: "CHANGE_USER", user });

      window.localStorage.setItem("currentBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
    } catch (exception) {
      console.log("error", exception);
      dispatch(setNotification("Wrong username or password", 5));
    }
  };
};

export const clearUser = () => {
  return (dispatch) => {
    dispatch({ type: "CHANGE_USER", user: null });
    window.localStorage.removeItem("currentBloglistUser");
    blogService.setToken("");
  };
};

export default userReducer;

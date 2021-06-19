import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, Link, useRouteMatch } from "react-router-dom";
import { initBlogs } from "./reducers/blogReducer";
import { setUser, clearUser } from "./reducers/userReducer";
import { getUsers } from "./reducers/usersReducer";

import Blogs from "./components/Blogs";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import NewBlogForm from "./components/NewBlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import Users from "./components/Users";
import User from "./components/User";

const App = () => {
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const blogs = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const toggleBlogFormRef = useRef();

  useEffect(() => dispatch(initBlogs()), []);

  useEffect(() => dispatch(getUsers()), []);

  useEffect(() => {
    const userJSON = window.localStorage.getItem("currentBloglistUser");
    if (userJSON) {
      const savedUser = JSON.parse(userJSON);
      dispatch(setUser(savedUser));
    }
  }, []);

  // Could alternatively use useParams in User and Blog components to find objects.
  const userMatch = useRouteMatch("/users/:id");
  const clickedUser = userMatch
    ? users.find((u) => u.id === userMatch.params.id)
    : null;

  const blogMatch = useRouteMatch("/blogs/:id");
  const clickedBlog = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null;

  return (
    <div>
      {user === null ? (
        <LoginForm />
      ) : (
        <>
          <div className="nav-bar">
            <Link to={"/"}>
              <p>blogs</p>
            </Link>
            <Link to={"/users"}>
              <p>users</p>
            </Link>
            <p>{user.name} logged in</p>
            <button onClick={() => dispatch(clearUser())}>logout</button>
          </div>

          <h2>blog app</h2>
          <Notification cssClass="notification" />

          <Switch>
            <Route path="/users/:id">
              <User user={clickedUser} />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/blogs/:id">
              <Blog blog={clickedBlog} />
            </Route>

            <Route path="/">
              <Togglable buttonLabel="create new blog" ref={toggleBlogFormRef}>
                <NewBlogForm
                  toggleVisibility={() =>
                    toggleBlogFormRef.current.toggleVisibility()
                  }
                />
              </Togglable>
              <Blogs />
            </Route>
          </Switch>
        </>
      )}
    </div>
  );
};

export default App;

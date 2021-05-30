import React, { useState, useEffect, useRef } from "react";
import Blogs from "./components/Blogs";
import LoginForm from "./components/LoginForm";
import NewBlogForm from "./components/NewBlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const toggleBlogFormRef = useRef();

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  }, []);

  useEffect(() => {
    const userJSON = window.localStorage.getItem("currentBloglistUser");
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("currentBloglistUser");
    blogService.setToken("");
  };

  const addBlog = async (newBlog) => {
    toggleBlogFormRef.current.toggleVisibility();
    const blog = await blogService.addBlog(newBlog);
    setBlogs(blogs.concat(blog).sort((a, b) => b.likes - a.likes));

    setNotificationMessage(`a new blog ${blog.title} by ${blog.author} added`);
    setTimeout(() => setNotificationMessage(null), 5000);
  };

  const incrementLikes = async (blog) => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    const updatedBlog = await blogService.updateBlog(blog.id, newBlog);
    setBlogs(
      blogs
        .map((blog) => (blog.id !== updatedBlog.id ? blog : updatedBlog))
        .sort((a, b) => b.likes - a.likes)
    );
  };

  const deleteBlog = async (id) => {
    const blog = blogs.find((blog) => blog.id === id);
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.deleteBlog(id);
      setBlogs(
        blogs.filter((blog) => blog.id !== id).sort((a, b) => b.likes - a.likes)
      );
    }
  };

  return (
    <div>
      {user === null ? (
        <LoginForm setUser={setUser} />
      ) : (
        <>
          <h2>blogs</h2>
          <Notification message={notificationMessage} cssClass="notification" />
          <p>
            {user.name} logged in <button onClick={logout}>logout</button>
          </p>
          <Togglable buttonLabel="create new blog" ref={toggleBlogFormRef}>
            <NewBlogForm addBlog={addBlog} />
          </Togglable>
          <Blogs
            blogs={blogs}
            user={user}
            incrementLikes={incrementLikes}
            deleteBlog={deleteBlog}
          />
        </>
      )}
    </div>
  );
};

export default App;

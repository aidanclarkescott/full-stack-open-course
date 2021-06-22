import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";
import { TextField, Button, Typography } from "@material-ui/core";

const NewBlogForm = ({ toggleVisibility }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const dispatch = useDispatch();

  const handleCreateBlog = (event) => {
    event.preventDefault();
    toggleVisibility();

    dispatch(
      addBlog({
        title,
        author,
        url,
      })
    );

    dispatch(setNotification(`a new blog ${title} by ${author} added`, 5));

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <>
      <Typography variant="h5" component="h3">
        Create New Blog
      </Typography>
      <form onSubmit={handleCreateBlog} id="new-blog-form">
        <div>
          <TextField
            label="title"
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            label="author"
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            label="url"
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <br />
        <Button variant="contained" color="primary" type="submit">
          create
        </Button>
      </form>
    </>
  );
};

export default NewBlogForm;

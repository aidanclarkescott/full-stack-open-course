import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { likeBlog, deleteBlog, commentOnBlog } from "../reducers/blogReducer";
import { TextField, Button, Typography } from "@material-ui/core";

const Blog = ({ blog }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();

  if (!blog) return null;

  const handleDelete = () => {
    dispatch(deleteBlog(blog));
    history.push("/");
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (e.target.comment.value === "") return;
    dispatch(commentOnBlog(blog, e.target.comment.value));
    e.target.comment.value = "";
  };

  return (
    <div>
      <Typography variant="h5">
        {blog.title} by {blog.author}
      </Typography>
      <br />
      <Typography variant="body1">
        <a href={`https://${blog.url}`}>{blog.url}</a>
      </Typography>
      <Typography variant="body1">
        likes: {blog.likes}{" "}
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={() => dispatch(likeBlog(blog))}
        >
          like
        </Button>{" "}
      </Typography>
      <Typography variant="body1">added by {blog.user.name}</Typography>
      <br />
      {user.username === blog.user.username && (
        <Button
          color="secondary"
          variant="contained"
          size="small"
          onClick={handleDelete}
        >
          remove
        </Button>
      )}

      <Typography variant="h6">Comments</Typography>
      <form onSubmit={handleComment}>
        <div>
          <TextField label="comment" type="text" name="comment" />
        </div>
        <br />
        <Button variant="contained" color="primary" type="submit">
          add comment
        </Button>
      </form>
      <ul>
        {blog.comments.map((comment, commentIdx) => (
          <li key={commentIdx}>
            <Typography variant="body2">{comment}</Typography>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;

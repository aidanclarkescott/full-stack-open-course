import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { likeBlog, deleteBlog, commentOnBlog } from "../reducers/blogReducer";

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
    dispatch(commentOnBlog(blog, e.target.comment.value));
    e.target.comment.value = "";
  };

  return (
    <div>
      <h1>
        {blog.title} {blog.author}
      </h1>
      <a href={`https://${blog.url}`}>{blog.url}</a>
      <br />
      likes: {blog.likes}
      <button onClick={() => dispatch(likeBlog(blog))}>like</button>
      <br />
      added by {blog.user.name}
      <br />
      {user.username === blog.user.username && (
        <button onClick={handleDelete}>remove</button>
      )}
      <h3>comments</h3>
      <form onSubmit={handleComment}>
        <input type="text" name="comment" />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, commentIdx) => (
          <li key={commentIdx}>{comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;

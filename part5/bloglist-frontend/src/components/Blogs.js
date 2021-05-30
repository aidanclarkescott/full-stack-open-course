import React from "react";
import Blog from "./Blog";
import PropTypes from "prop-types";

const Blogs = ({ blogs, user, incrementLikes, deleteBlog }) => {
  return (
    <>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          incrementLikes={incrementLikes}
          deleteBlog={deleteBlog}
        />
      ))}
    </>
  );
};

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  incrementLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

export default Blogs;

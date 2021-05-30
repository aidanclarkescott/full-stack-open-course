import React, { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, user, incrementLikes, deleteBlog }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      {isExpanded ? (
        <>
          <button onClick={() => setIsExpanded(false)}>hide</button>
          <div>
            {blog.url}
            <br />
            likes: {blog.likes}
            <button onClick={() => incrementLikes(blog)}>like</button>
            <br />
            {blog.user.name}
            <br />
            {user.username === blog.user.username ? (
              <button onClick={() => deleteBlog(blog.id)}>remove</button>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <button onClick={() => setIsExpanded(true)}>view</button>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  incrementLikes: PropTypes.func,
  deleteBlog: PropTypes.func,
};

export default Blog;

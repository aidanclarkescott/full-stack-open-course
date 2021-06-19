import blogService from "../services/blogs";

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_BLOGS":
      return action.data;
    case "ADD_BLOG":
      return [...state, action.data].sort((a, b) => b.likes - a.likes);
    case "UPDATE": {
      const updatedBlog = action.data;
      return state
        .map((blog) => (blog.id !== updatedBlog.id ? blog : updatedBlog))
        .sort((a, b) => b.likes - a.likes);
    }
    case "DELETE":
      return state
        .filter((blog) => blog.id !== action.data.id)
        .sort((a, b) => b.likes - a.likes);
    default:
      return state;
  }
};

export const initBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();

    dispatch({
      type: "INIT_BLOGS",
      data: blogs.sort((a, b) => b.likes - a.likes),
    });
  };
};

export const addBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.addBlog(blog);
    dispatch({
      type: "ADD_BLOG",
      data: newBlog,
    });
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    const updatedBlog = await blogService.updateBlog(blog.id, newBlog);

    dispatch({ type: "UPDATE", data: updatedBlog });
  };
};

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.deleteBlog(blog.id);
      dispatch({ type: "DELETE", data: { id: blog.id } });
    }
  };
};

export const commentOnBlog = (blog, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.comment(blog.id, comment);
    dispatch({ type: "UPDATE", data: updatedBlog });
  };
};

export default blogReducer;

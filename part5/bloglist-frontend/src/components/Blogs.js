import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  TableContainer,
  Paper,
  TableBody,
  Table,
  TableRow,
  TableCell,
} from "@material-ui/core";

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </TableCell>
              <TableCell>{blog.author}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Blogs;

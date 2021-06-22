import React from "react";
import {
  TableContainer,
  Paper,
  TableBody,
  Table,
  TableRow,
  TableCell,
  Typography,
} from "@material-ui/core";

const User = ({ user }) => {
  if (!user) return null;

  return (
    <div>
      <Typography variant="h4">{user.name}</Typography>
      <br />
      <Typography variant="h6">added blogs</Typography>
      <br />
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {user.blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <li>{blog.title}</li>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default User;

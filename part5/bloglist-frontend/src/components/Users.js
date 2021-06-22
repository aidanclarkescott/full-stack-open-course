import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  TableContainer,
  Paper,
  TableBody,
  TableHead,
  Table,
  TableRow,
  TableCell,
  Typography,
} from "@material-ui/core";

const Users = () => {
  const users = useSelector((state) => state.users);

  return (
    <div>
      <Typography variant="h4">Users</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                  </TableCell>
                  <TableCell>{user.blogs.length}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;

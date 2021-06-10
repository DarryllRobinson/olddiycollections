import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Table } from 'semantic-ui-react';

import { fetchUsers, selectAllUsers } from './usersSlice';
import MysqlLayer from '../../services/MysqlLayer';
const mysqlLayer = new MysqlLayer();

export const EditUsersForm = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  console.log('users: ', users);

  const userStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  React.useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  const deactivateUser = async (userId) => {
    await mysqlLayer.Put(`/users/deactivate/${userId}`).then((response) => {
      if (response.affectedRows === 1) {
        console.log('success', response);
        dispatch(fetchUsers());
      } else {
        console.log('error', response);
      }
    });
  };

  const reactivateUser = async (userId) => {
    await mysqlLayer.Put(`/users/reactivate/${userId}`).then((response) => {
      if (response.affectedRows === 1) {
        console.log('success', response);
        dispatch(fetchUsers());
      } else {
        console.log('error', response);
      }
    });
  };

  let content;

  if (userStatus === 'loading') {
    content = (
      <Table.Row>
        <Table.Cell className="loader">Loading...</Table.Cell>
      </Table.Row>
    );
  } else if (userStatus === 'succeeded') {
    content = users.map((user, idx) => {
      const userId = user.id;
      return (
        <Table.Row key={idx}>
          <Table.Cell key={idx + 1}>{user.email}</Table.Cell>
          <Table.Cell key={idx + 2}>{user.firstName}</Table.Cell>
          <Table.Cell key={idx + 3}>{user.surname}</Table.Cell>
          <Table.Cell key={idx + 4}>{user.role}</Table.Cell>

          {user.active === 1 && (
            <Table.Cell key={idx + 5} textAlign="center">
              <Button negative onClick={() => deactivateUser(userId)}>
                Deactivate
              </Button>
            </Table.Cell>
          )}
          {user.active === 0 && (
            <Table.Cell key={idx + 5} textAlign="center">
              <Button positive onClick={() => reactivateUser(userId)}>
                Reactivate
              </Button>
            </Table.Cell>
          )}
        </Table.Row>
      );
    });
  } else if (userStatus === 'error') {
    content = <div>{error}</div>;
  }

  return (
    <Container>
      <Table className="userAdmin" celled fixed selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Username</Table.HeaderCell>
            <Table.HeaderCell>First Name</Table.HeaderCell>
            <Table.HeaderCell>Surname</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{content}</Table.Body>
      </Table>
    </Container>
  );
};

import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { AddUserForm } from '../users/AddUserForm';
import { EditUsersForm } from '../users/EditUsersForm';

import { fetchUsers, selectAllUsers } from '../users/usersSlice';

export const Admin = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  console.log('users: ', users);

  const userStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  const loadUsers = () => {
    dispatch(fetchUsers());
  };

  React.useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  let content;

  if (userStatus === 'loading') {
    content = <Container className="loader">Loading...</Container>;
  } else if (userStatus === 'succeeded') {
    content = (
      <Container>
        <Header>User Admininistration</Header>
        <AddUserForm loadUsers={loadUsers} />
        <EditUsersForm users={users} loadUsers={loadUsers} />
      </Container>
    );
  } else if (userStatus === 'error') {
    content = <Container>{error}</Container>;
  }

  return <Container>{content}</Container>;
};

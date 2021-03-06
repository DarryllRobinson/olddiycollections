import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { AddUserForm } from '../users/AddUserForm';
import { EditUsersForm } from '../users/EditUsersForm';
import { fetchUsers, selectAllUsers } from '../users/usersSlice';

import { AddClientForm } from '../clients/AddClientForm';
import { EditClientsForm } from '../clients/EditClientsForm';
import { fetchClients, selectAllClients } from '../clients/clientsSlice';

export const Admin = (props) => {
  console.log('Admin props: ', props);
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const dispatch = useDispatch();

  // User section
  const users = useSelector(selectAllUsers);
  console.log('users: ', users);

  const userStatus = useSelector((state) => state.users.status);
  const userError = useSelector((state) => state.users.error);

  const loadUsers = () => {
    dispatch(fetchUsers());
  };

  React.useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  let userContent;

  if (userStatus === 'loading') {
    userContent = <Container className="loader">Loading...</Container>;
  } else if (userStatus === 'succeeded') {
    userContent = (
      <Container>
        <Header>User Admininistration</Header>
        <AddUserForm loadUsers={loadUsers} />
        <EditUsersForm users={users} loadUsers={loadUsers} />
      </Container>
    );
  } else if (userStatus === 'error') {
    userContent = <Container>{userError}</Container>;
  }

  // User section
  const clients = useSelector(selectAllClients);
  console.log('clients: ', clients);

  const clientStatus = useSelector((state) => state.clients.status);
  const error = useSelector((state) => state.clients.error);

  const loadClients = () => {
    dispatch(fetchClients());
  };

  React.useEffect(() => {
    if (clientStatus === 'idle') {
      dispatch(fetchClients());
    }
  }, [clientStatus, dispatch]);

  let clientContent;

  if (clientStatus === 'loading') {
    clientContent = <Container className="loader">Loading...</Container>;
  } else if (clientStatus === 'succeeded') {
    clientContent = (
      <Container>
        <Header>Client Admininistration</Header>
        <AddClientForm loadClients={loadClients} />
        <EditClientsForm clients={clients} loadClients={loadClients} />
      </Container>
    );
  } else if (clientStatus === 'error') {
    clientContent = <Container>{error}</Container>;
  }

  return (
    <Container>
      {userContent}
      {clientContent}
    </Container>
  );
};

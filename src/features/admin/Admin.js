import React from 'react';
import { Container, Header } from 'semantic-ui-react';

import { AddUserForm } from '../users/AddUserForm';
import { EditUsersForm } from '../users/EditUsersForm';

export const Admin = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container>
      <Header>User Admininistration</Header>
      <AddUserForm />
      <EditUsersForm />
    </Container>
  );
};

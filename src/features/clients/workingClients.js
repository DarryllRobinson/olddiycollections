import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { AddClientForm } from '../clients/AddClientForm';
import { EditClientsForm } from '../clients/EditClientsForm';
import { fetchClients, selectAllClients } from '../clients/clientsSlice';

export const Clients = (props) => {
  console.log('Clients props: ', props);
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const dispatch = useDispatch();

  // Client section
  const clients = useSelector(selectAllClients);
  console.log('clients: ', clients);

  const clientStatus = useSelector((state) => state.clients.status);
  const clientError = useSelector((state) => state.clients.error);

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
    clientContent = <Container>{clientError}</Container>;
  }
  return <Container>{clientContent}</Container>;
};

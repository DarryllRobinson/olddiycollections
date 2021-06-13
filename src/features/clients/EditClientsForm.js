import React from 'react';
import { Button, Container, Table } from 'semantic-ui-react';

import MysqlLayer from '../../services/MysqlLayer';
const mysqlLayer = new MysqlLayer();

export const EditClientsForm = (props) => {
  const { loadClients } = props;
  const { clients } = props;

  const deactivateClient = async (clientId) => {
    await mysqlLayer.Put(`/clients/deactivate/${clientId}`).then((response) => {
      if (response.affectedRows === 1) {
        console.log('success', response);
        loadClients();
      } else {
        console.log('error', response);
      }
    });
  };

  const reactivateClient = async (clientId) => {
    await mysqlLayer.Put(`/clients/reactivate/${clientId}`).then((response) => {
      if (response.affectedRows === 1) {
        console.log('success', response);
        loadClients();
      } else {
        console.log('error', response);
      }
    });
  };

  const content = clients.map((client, idx) => {
    const clientId = client.id;
    return (
      <Table.Row key={idx}>
        <Table.Cell key={idx + 11}>{client.name}</Table.Cell>
        <Table.Cell key={idx + 12}>{client.regNum}</Table.Cell>
        <Table.Cell key={idx + 13}>{client.mainContact}</Table.Cell>
        <Table.Cell key={idx + 14}>{client.phone}</Table.Cell>
        <Table.Cell key={idx + 15}>{client.email}</Table.Cell>

        {client.active === 1 && (
          <Table.Cell key={idx + 16} textAlign="center">
            <Button negative onClick={() => deactivateClient(clientId)}>
              Deactivate
            </Button>
          </Table.Cell>
        )}
        {client.active === 0 && (
          <Table.Cell key={idx + 16} textAlign="center">
            <Button positive onClick={() => reactivateClient(clientId)}>
              Reactivate
            </Button>
          </Table.Cell>
        )}
      </Table.Row>
    );
  });

  return (
    <Container>
      <Table className="clientAdmin" celled fixed selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Company Name</Table.HeaderCell>
            <Table.HeaderCell>Registration Number</Table.HeaderCell>
            <Table.HeaderCell>Main Contact</Table.HeaderCell>
            <Table.HeaderCell>Phone</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{content}</Table.Body>
      </Table>
    </Container>
  );
};

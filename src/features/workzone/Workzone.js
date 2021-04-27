import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'semantic-ui-react';

import { fetchWorkzone, selectAllWorkzone } from './workzoneSlice';

export const Workzone = () => {
  const dispatch = useDispatch();
  const workzones = useSelector(selectAllWorkzone);
  //console.log(workzone);
  const workzoneStatus = useSelector((state) => state.workzone.status);
  const error = useSelector((state) => state.workzone.error);

  useEffect(() => {
    if (workzoneStatus === 'idle') {
      dispatch(fetchWorkzone());
    }
  }, [dispatch, workzoneStatus]);

  let content;

  if (workzoneStatus === 'loading') {
    content = (
      <Table.Row>
        <Table.Cell>
          <div className="loading">Loading...</div>
        </Table.Cell>
      </Table.Row>
    );
  } else if (workzoneStatus === 'failed') {
    content = (
      <Table.Row>
        <Table.Cell>{error}</Table.Cell>
      </Table.Row>
    );
  } else if (workzoneStatus === 'succeeded') {
    content = workzones.map((workzone) => {
      return (
        <Table.Row key={workzone.id}>
          <Table.Cell>{workzone.accountNumber}</Table.Cell>
          <Table.Cell>{workzone.customerName}</Table.Cell>
          <Table.Cell>{workzone.regIdNumber}</Table.Cell>
          <Table.Cell textAlign="right">R {workzone.currentBalance}</Table.Cell>
          <Table.Cell textAlign="right">R {workzone.amountDue}</Table.Cell>
          <Table.Cell textAlign="right">R {workzone.totalBalance}</Table.Cell>
        </Table.Row>
      );
    });
  }

  return (
    <Table celled selectable color="grey" inverted unstackable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Account Number</Table.HeaderCell>
          <Table.HeaderCell>Customer Name</Table.HeaderCell>
          <Table.HeaderCell>Registration / ID Number</Table.HeaderCell>
          <Table.HeaderCell>Current Balance</Table.HeaderCell>
          <Table.HeaderCell>Amount Due</Table.HeaderCell>
          <Table.HeaderCell>Total Due</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{content}</Table.Body>
    </Table>
  );
};

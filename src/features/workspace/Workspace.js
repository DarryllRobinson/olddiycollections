import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'semantic-ui-react';

import { fetchWorkspace, selectAllWorkspace } from './workspaceSlice';

export const Workspace = () => {
  const dispatch = useDispatch();
  const workspace = useSelector(selectAllWorkspace);
  const workspaceStatus = useSelector((state) => state.workspace.status);
  const error = useSelector((state) => state.workspace.error);

  useEffect(() => {
    if (workspaceStatus === 'idle') {
      dispatch(fetchWorkspace());
    }
  }, [dispatch, workspaceStatus]);

  let content;

  if (workspaceStatus === 'loading') {
    content = (
      <Table.Row>
        <Table.Cell>
          <div className="loading">Loading...</div>
        </Table.Cell>
      </Table.Row>
    );
  } else if (workspaceStatus === 'failed') {
    content = (
      <Table.Row>
        <Table.Cell>{error}</Table.Cell>
      </Table.Row>
    );
  } else if (workspaceStatus === 'succeeded') {
    content = workspace.map((workspace) => {
      return (
        <Table.Row key={workspace.id}>
          <Table.Cell>{workspace.accountNumber}</Table.Cell>
          <Table.Cell>{workspace.customerName}</Table.Cell>
          <Table.Cell>{workspace.regIdNumber}</Table.Cell>
          <Table.Cell textAlign="right">
            R {workspace.currentBalance}
          </Table.Cell>
          <Table.Cell textAlign="right">R {workspace.amountDue}</Table.Cell>
          <Table.Cell textAlign="right">R {workspace.totalBalance}</Table.Cell>
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

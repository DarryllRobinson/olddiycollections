import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

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
          <Table.Cell>{workspace.caseNumber}</Table.Cell>
          <Table.Cell>{workspace.accountNumber}</Table.Cell>
          <Table.Cell>{workspace.customerName}</Table.Cell>
          <Table.Cell>{workspace.regIdNumber}</Table.Cell>
          <Table.Cell textAlign="right">{workspace.debtorAge}</Table.Cell>
          <Table.Cell>{workspace.caseNotes}</Table.Cell>
          <Table.Cell textAlign="right">R {workspace.totalBalance}</Table.Cell>
          <Table.Cell textAlign="right">R {workspace.amountDue}</Table.Cell>
          <Table.Cell textAlign="right">
            R {workspace.currentBalance}
          </Table.Cell>
          <Table.Cell>{workspace.resolution}</Table.Cell>
          <Table.Cell>
            {moment(workspace.nextVisitDateTime).format('YYYY-MM-DD HH:mm')}
          </Table.Cell>
          <Table.Cell>{workspace.currentAssignment}</Table.Cell>
          <Table.Cell>{workspace.updatedBy}</Table.Cell>
          <Table.Cell>
            {moment(workspace.updatedDate).format('YYYY-MM-DD HH:mm')}
          </Table.Cell>
        </Table.Row>
      );
    });
  }

  return (
    <Table
      celled
      selectable
      unstackable
      compact
      size="small"
      color="blue"
      inverted
    >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Case Number</Table.HeaderCell>
          <Table.HeaderCell>Account Number</Table.HeaderCell>
          <Table.HeaderCell>Customer Name</Table.HeaderCell>
          <Table.HeaderCell>Registration / ID Number</Table.HeaderCell>
          <Table.HeaderCell>Debtor Age</Table.HeaderCell>
          <Table.HeaderCell>Case Notes</Table.HeaderCell>
          <Table.HeaderCell>Total Balance</Table.HeaderCell>
          <Table.HeaderCell>Amount Due</Table.HeaderCell>
          <Table.HeaderCell>Current Balance</Table.HeaderCell>
          <Table.HeaderCell>Resolution</Table.HeaderCell>
          <Table.HeaderCell>Next Visit Date and Time</Table.HeaderCell>
          <Table.HeaderCell>Current Assignment</Table.HeaderCell>
          <Table.HeaderCell>Updated By</Table.HeaderCell>
          <Table.HeaderCell>Updated Date</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{content}</Table.Body>
    </Table>
  );
};

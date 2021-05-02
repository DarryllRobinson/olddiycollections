import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

import { fetchCollections, selectAllCollections } from './collectionsSlice';

export const Collections = () => {
  const dispatch = useDispatch();
  const collections = useSelector(selectAllCollections);
  const collectionsStatus = useSelector((state) => state.collections.status);
  const error = useSelector((state) => state.collections.error);

  useEffect(() => {
    if (collectionsStatus === 'idle') {
      dispatch(fetchCollections());
    }
  }, [dispatch, collectionsStatus]);

  let content;

  if (collectionsStatus === 'loading') {
    content = (
      <Table.Row>
        <Table.Cell>
          <div className="loading">Loading...</div>
        </Table.Cell>
      </Table.Row>
    );
  } else if (collectionsStatus === 'failed') {
    content = (
      <Table.Row>
        <Table.Cell>{error}</Table.Cell>
      </Table.Row>
    );
  } else if (collectionsStatus === 'succeeded') {
    content = collections.map((collections) => {
      const hlink = `/collection/${collections.id}`;
      return (
        <Table.Row key={collections.id}>
          <Table.Cell>
            <a href={hlink} style={{ color: 'white' }}>
              Open: {collections.caseNumber}
            </a>
          </Table.Cell>
          <Table.Cell>{collections.accountNumber}</Table.Cell>
          <Table.Cell>{collections.customerName}</Table.Cell>
          <Table.Cell>{collections.regIdNumber}</Table.Cell>
          <Table.Cell textAlign="right">{collections.debtorAge}</Table.Cell>
          <Table.Cell>{collections.caseNotes}</Table.Cell>
          <Table.Cell textAlign="right">
            R {collections.totalBalance}
          </Table.Cell>
          <Table.Cell textAlign="right">R {collections.amountDue}</Table.Cell>
          <Table.Cell textAlign="right">
            R {collections.currentBalance}
          </Table.Cell>
          <Table.Cell>{collections.resolution}</Table.Cell>
          <Table.Cell>
            {moment(collections.nextVisitDateTime).format('YYYY-MM-DD HH:mm')}
          </Table.Cell>
          <Table.Cell>{collections.currentAssignment}</Table.Cell>
          <Table.Cell>{collections.updatedBy}</Table.Cell>
          <Table.Cell>
            {moment(collections.updatedDate).format('YYYY-MM-DD HH:mm')}
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

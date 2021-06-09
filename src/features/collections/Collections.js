import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Container,
  Dimmer,
  Header,
  Loader,
  Table,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { fetchCollections, selectAllCollections } from './collectionsSlice';

export const Collections = (props) => {
  //console.log('Collections props', props);
  const { caseStatus } = props.location.state ? props.location.state : 'Open';
  const [recordStatus, setRecordStatus] = React.useState('Open');
  //console.log('caseStatus: ', caseStatus);
  //console.log('props.location.state: ', props.location.state);
  const dispatch = useDispatch();
  /*const collections = useSelector((state) =>
    fetchCollectionsByStatus(state, caseStatus)
  );*/
  const collections = useSelector(selectAllCollections);
  //console.log('collections: ', collections);

  const collectionsStatus = useSelector((state) => state.collections.status);
  const error = useSelector((state) => state.collections.error);

  useEffect(() => {
    if (collectionsStatus === 'idle') {
      setRecordStatus(caseStatus);
      dispatch(fetchCollections(recordStatus));
    }
  }, [dispatch, caseStatus, collectionsStatus, recordStatus]);

  const loadRecords = (caseStatus) => {
    console.log('loading records: ', caseStatus);
    setRecordStatus(caseStatus);
    dispatch(fetchCollections(recordStatus));
  };

  let content;

  if (collectionsStatus === 'loading') {
    content = (
      <Table.Row>
        <Table.Cell>
          <Dimmer active>
            <Loader>Loading...</Loader>
          </Dimmer>
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
      if (collections.currentStatus === recordStatus) {
        const hlink = `/collection/${collections.id}`;
        return (
          <Table.Row className="collections row" key={collections.id}>
            <Table.Cell>
              <Button as={Link} to={hlink} style={{ padding: '10px' }}>
                Open
              </Button>
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
      } else {
        return null;
      }
    });
  }

  const renderHeader = () => {
    //console.log('recordStatus: ', recordStatus);
    switch (recordStatus) {
      case 'Closed':
        return (
          <Header as="h2" dividing style={{ padding: '15px' }}>
            Collections: {recordStatus}{' '}
            <Button onClick={() => loadRecords('Open')}>Load Open</Button>
            <Button onClick={() => loadRecords('Pended')}>Load Pended</Button>
          </Header>
        );
      case 'Open':
        return (
          <Header as="h2" dividing style={{ padding: '15px' }}>
            Collections: {recordStatus}{' '}
            <Button onClick={() => loadRecords('Closed')}>Load Closed</Button>
            <Button onClick={() => loadRecords('Pended')}>Load Pended</Button>
          </Header>
        );
      case 'Pended':
        return (
          <Header as="h2" dividing style={{ padding: '15px' }}>
            Collections: {recordStatus}{' '}
            <Button onClick={() => loadRecords('Closed')}>Load Closed</Button>
            <Button onClick={() => loadRecords('Open')}>Load Open</Button>
          </Header>
        );
      default:
        return (
          <Header as="h2" dividing style={{ padding: '15px' }}>
            Collections: {recordStatus} Status not found
          </Header>
        );
    }
  };

  return (
    <Container className="collections">
      {renderHeader()}

      <Table
        className="collections"
        celled
        selectable
        unstackable
        compact
        size="small"
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
    </Container>
  );
};

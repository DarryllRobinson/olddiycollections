import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Container, Divider, Form, Input } from 'semantic-ui-react';
import moment from 'moment';

import { fetchCollection, selectCollectionById } from './collectionsSlice';
import { Outcomes } from '../outcomes/Outcomes';
import { Contacts } from '../contacts/Contacts';
import { CollectionForm } from './CollectionForm';

import MysqlLayer from '../../services/MysqlLayer';

export const Collection = (props) => {
  // Scroll to top
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  //console.log('props', props);

  //const [prevStatus, setPrevStatus] = React.useState('Open');
  const mysqlLayer = new MysqlLayer();

  const { id } = props.match.params;
  const { role, user } = props;
  //console.log('Collection id: ', id);
  const dispatch = useDispatch();
  const collection = useSelector((state) => selectCollectionById(state, id));

  const collectionStatus = useSelector((state) => state.collections.status);
  const error = useSelector((state) => state.collections.error);
  console.log('collection status: ', collectionStatus);
  console.log('collection: ', collection);

  useEffect(() => {
    if (collectionStatus === 'idle') {
      dispatch(fetchCollection(id));
    }
  }, [dispatch, collectionStatus, id]);

  // Handlers
  let content;

  //console.log('outcomeNotesBundle: ', outcomeNotesBundle);

  if (collectionStatus === 'loading') {
    content = <Form loading></Form>;
  } else if (collectionStatus === 'failed') {
    content = <Form>{error}</Form>;
  } else if (collectionStatus === 'succeeded') {
    // What does our state look like?
    //  const fieldList = state.fields.ids;
    //  console.log('fieldList: ', fieldList);
    //  console.log('emailUsed: ', state.fields.entities['emailUsed']);

    // Preparing variables for rendering
    const regIdNumberRender = () => {
      if (collection.customerEntity === 'Enterprise') {
        return (
          <Form.Input
            fluid
            label="Registration Number"
            id="form-input-control-regIdNumber"
            readOnly
            width="4"
            defaultValue={collection.regIdNumber}
          />
        );
      } else if (collection.customerEntity === 'Consumer') {
        return (
          <Form.Input
            fluid
            label="ID Number"
            id="form-input-control-regIdNumber"
            readOnly
            width="4"
            defaultValue={collection.regIdNumber}
          />
        );
      }
    };

    /*const cipcStatusOptions = [
      { key: 'i', text: 'In Business', value: 'In Business' },
      { key: 'f', text: 'Final Deregistration', value: 'Final Deregistration' },
    ];

    const idvStatusOptions = [
      { key: 'a', text: 'Alive', value: 'Alive' },
      { key: 'd', text: 'Deceased', value: 'Deceased' },
    ];*/

    const cipcIdvStatus = () => {
      if (collection.customerEntity === 'Enterprise') {
        return (
          <Form.Input
            defaultValue={collection.regIdStatus}
            id="form-input-control-regIdStatus"
            label="CIPC Status"
            name="regIdStatus"
            readOnly
            width="4"
          />
        );
      } else if (collection.customerEntity === 'Consumer') {
        return (
          <Form.Input
            defaultValue={collection.regIdStatus}
            id="form-input-control-regIdStatus"
            label="IDV Status"
            name="regIdStatus"
            readOnly
            width="4"
          />
        );
      }
    };

    /*const accountStatusList = [
      { key: 'a', text: 'Active', value: 'Active' },
      { key: 'c', text: 'Cancelled', value: 'Cancelled' },
      { key: 'o', text: 'Open', value: 'Open' },
      { key: 's', text: 'Suspended', value: 'Suspended' },
    ];*/

    const currencyFormatter = (currency) => {
      if (currency !== 0) {
        return (
          'R ' + currency.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
        );
      } else {
        return 'R 0.00';
      }
    };

    // lock the record so no other agent accidentally opens it
    const dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const update = {
      currentStatus: 'Locked',
      lockedDateTime: dateTime,
    };
    mysqlLayer.Put(`/cases/case/${id}`, update);

    content = (
      <Container>
        <Card raised centered fluid>
          <Card.Header className="collection-card-header">
            <Card.Content>Case Number {collection.caseNumber}</Card.Content>
          </Card.Header>
          <Card.Content>
            <Form>
              <Form.Group widths="equal">
                <Form.TextArea
                  label={`Account Number ${collection.accountNumber} - Notes`}
                  id="form-input-control-accountNumber"
                  readOnly
                  rows="3"
                  defaultValue={collection.accountNotes}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.TextArea
                  label="Case Notes"
                  id="form-input-control-caseNotes"
                  readOnly
                  rows="3"
                  defaultValue={collection.caseNotes}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.TextArea
                  label="KAM Notes"
                  id="form-input-control-kamNotes"
                  readOnly
                  rows="3"
                  defaultValue={collection.kamNotes}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Customer Name"
                  id="form-input-control-customerName"
                  readOnly
                  defaultValue={collection.customerName}
                />
              </Form.Group>
              <Form.Group>
                {regIdNumberRender()}
                {cipcIdvStatus()}
              </Form.Group>

              <br />
              <Divider horizontal>Account Information</Divider>
              <br />

              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Debtor Age"
                  id="form-input-control-debtorAge"
                  readOnly
                  defaultValue={collection.debtorAge}
                />
                <Form.Input
                  fluid
                  label="Credit Limit"
                  id="form-input-control-creditLimit"
                  readOnly
                  defaultValue={currencyFormatter(collection.creditLimit)}
                />
                <Form.Input
                  fluid
                  label="Total Balance"
                  id="form-input-control-totalBalance"
                  readOnly
                  defaultValue={currencyFormatter(collection.totalBalance)}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Amount Due"
                  id="form-input-control-amountDue"
                  readOnly
                  defaultValue={currencyFormatter(collection.amountDue)}
                />
                <Form.Input
                  fluid
                  label="Current Balance"
                  id="form-input-control-currentBalance"
                  readOnly
                  defaultValue={currencyFormatter(collection.currentBalance)}
                />
                <Form.Input
                  fluid
                  id="form-input-control-account-status"
                  label="Account Status"
                  name="accountStatus"
                  readOnly
                  value={collection.accountStatus}
                />
              </Form.Group>

              <br />
              <Divider horizontal>Days on book</Divider>
              <br />

              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="30 Days"
                  id="form-input-control-days30"
                  readOnly
                  defaultValue={currencyFormatter(collection.days30)}
                />
                <Form.Input
                  fluid
                  label="60 Days"
                  id="form-input-control-days60"
                  readOnly
                  defaultValue={currencyFormatter(collection.days60)}
                />
                <Form.Input
                  fluid
                  label="90 Days"
                  id="form-input-control-days90"
                  readOnly
                  defaultValue={currencyFormatter(collection.days90)}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="120 Days"
                  id="form-input-control-days120"
                  readOnly
                  defaultValue={currencyFormatter(collection.days120)}
                />
                <Form.Input
                  fluid
                  label="150 Days"
                  id="form-input-control-days150"
                  readOnly
                  defaultValue={currencyFormatter(collection.days150)}
                />
                <Form.Input
                  fluid
                  label="180 Days"
                  id="form-input-control-days180"
                  readOnly
                  defaultValue={currencyFormatter(collection.days180)}
                />
                <Form.Input
                  fluid
                  label="+180 Days"
                  id="form-input-control-days180Over"
                  readOnly
                  defaultValue={currencyFormatter(collection.days180Over)}
                />
              </Form.Group>

              <br />
              <Divider horizontal>Payment Information</Divider>
              <br />

              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Payment Due Date"
                  id="form-input-control-paymentDueDate"
                  readOnly
                  defaultValue={collection.paymentDueDate}
                />
                <Form.Input
                  fluid
                  label="Debit Order Date"
                  id="form-input-control-debitOrderDate"
                  readOnly
                  defaultValue={collection.debitOrderDate}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Last Payment Date"
                  id="form-input-control-lastPaymentDate"
                  readOnly
                  defaultValue={moment(collection.lastPaymentDate).format(
                    'YYYY-MM-DD'
                  )}
                />
                <Form.Input
                  fluid
                  label="Last Payment Amount"
                  id="form-input-control-lastPaymentAmount"
                  readOnly
                  defaultValue={currencyFormatter(collection.lastPaymentAmount)}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Last PTP Date"
                  id="form-input-control-ptpDate"
                  readOnly
                  defaultValue={moment(collection.ptpDate).format('YYYY-MM-DD')}
                />
                <Form.Input
                  fluid
                  label="Last PTP Amount"
                  id="form-input-control-ptpAmount"
                  readOnly
                  defaultValue={currencyFormatter(collection.lastPTPAmount)}
                />
              </Form.Group>

              <br />
              <Divider horizontal>Follow-up Information</Divider>
              <br />

              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Next Visit Date and Time"
                  id="form-input-control-nextVisitDateTime"
                  readOnly
                  defaultValue={moment(collection.nextVisitDateTime).format(
                    'YYYY-MM-DD HH:mm'
                  )}
                />
                <Form.Input
                  fluid
                  label="Representative Name"
                  id="form-input-control-representativeName"
                  readOnly
                  defaultValue={collection.representativeName}
                />
                <Form.Field
                  control={Input}
                  id="form-input-control-representativeNumber"
                  label="Representative Number"
                  readOnly
                  defaultValue={collection.representativeNumber}
                >
                  <a
                    href={`tel:${collection.representativeNumber}`}
                    style={{
                      background: '#ECF0F1',
                      border: '1px solid #CED4DA',
                      borderRadius: '0.25rem',
                      color: '#7B8A8B',
                      display: 'block',
                      fontSize: '0.9375rem',
                      fontWeight: '400',
                      height: '2.5rem',
                      lineHeight: '1.5',
                      margin: '0',
                      padding: '0.375rem 0.75rem',
                      textDecoration: 'underline',
                      width: '100%',
                    }}
                  >
                    {collection.representativeNumber}
                  </a>
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal"></Form.Group>
            </Form>
            <Contacts id={collection.accountNumber} user={user} />
          </Card.Content>
        </Card>
        {/* --------------------------------------------- Outcome History section ------------------------------------------------------- */}
        <br />

        <Card raised centered fluid>
          <Outcomes id={id} />
        </Card>

        {/* --------------------------------------------- New activity section ------------------------------------------------------- */}
        <br />
        <CollectionForm
          accountNumber={collection.accountNumber}
          caseNotes={collection.caseNotes}
          caseStatus={collection.currentStatus}
          currentAssignment={collection.currentAssignment}
          currentStatus={collection.currentStatus}
          id={id}
          kamNotes={collection.kamNotes}
          outcomeNotes={''}
          role={role}
          user={user}
        />
      </Container>
    );
  }

  return <Container>{content}</Container>;
};

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Container, Form, Input } from 'semantic-ui-react';
import moment from 'moment';

import { fetchCollection, selectCollectionById } from './collectionsSlice';
import { Outcomes } from '../outcomes/Outcomes';

export const Collection = (props) => {
  const { id } = props.match.params;
  //console.log('Collection id: ', id);
  const dispatch = useDispatch();
  const collection = useSelector((state) => selectCollectionById(state, id));

  const collectionStatus = useSelector((state) => state.collections.status);
  const error = useSelector((state) => state.collections.error);

  useEffect(() => {
    if (collectionStatus === 'idle') {
      dispatch(fetchCollection(id));
    }
  }, [dispatch, collectionStatus, id]);

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

  const cipcIdvStatus = () => {
    if (collection.customerEntity === 'Enterprise') {
      return <Form.Input label="CIPC Status" width="4" defaultValue="cipc" />;
    } else if (collection.customerEntity === 'Consumer') {
      return <Form.Input label="IDV Status" width="4" defaultValue="idv" />;
    }
  };

  const accountStatusList = [
    { key: 'a', text: 'Active', value: 'Active' },
    { key: 'c', text: 'Cancelled', value: 'Cancelled' },
    { key: 'o', text: 'Open', value: 'Open' },
    { key: 's', text: 'Suspended', value: 'Suspended' },
  ];

  const transactionTypeOptions = [
    { key: 'a', text: 'Admin', value: 'Admin' },
    { key: 'c', text: 'Call', value: 'Call' },
    { key: 'e', text: 'Email', value: 'Email' },
  ];

  const currencyFormatter = (currency) => {
    return 'R ' + currency.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  };

  let content;

  if (collectionStatus === 'loading') {
    content = <Form loading></Form>;
  } else if (collectionStatus === 'failed') {
    content = <Form>{error}</Form>;
  } else if (collectionStatus === 'succeeded') {
    content = (
      <Container>
        <Card fluid>
          <Card.Header>Case Number {collection.caseNumber}</Card.Header>
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
              <Form.Select
                label="Account Status"
                id="form-input-control-accountStatus"
                options={accountStatusList}
                defaultValue={collection.accountStatus}
              />
            </Form.Group>

            <br />
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
                label="Representative Number"
                readOnly
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
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="Contacts to go here"
                id="form-input-control-representativeName"
                readOnly
                defaultValue="Contacts to go here"
              />
            </Form.Group>
          </Form>
        </Card>
        {/* --------------------------------------------- Outcome History section ------------------------------------------------------- */}
        <br />

        <Card fluid>
          <Form>
            <Outcomes id={id} />
          </Form>
        </Card>

        {/* --------------------------------------------- New activity section ------------------------------------------------------- */}
        <br />
        <Card fluid>
          <Form>
            <Form.Group widths="equal">
              <Form.Select
                fluid
                options={transactionTypeOptions}
                id="form-input-control-transaction-type-select"
                placeholder="Transaction Type"
                required
              />
              <Form.Input
                fluid
                id="form-input-control-numberCalled"
                placeholder="Number Called"
                required
              />
              <Form.Input
                fluid
                placeholder="Email Used"
                id="form-input-control-emailUsed"
                required
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="PTP Date"
                id="form-input-control-emailUsed"
                defaultValue="handlePTPDate"
              />
              <Form.Input
                fluid
                label="PTP Amount"
                id="form-input-control-ptpAmount"
                defaultValue="onValueChanged ptpAmount"
              />
              <Form.Input
                fluid
                label="Outcome Resolution"
                id="form-input-control-resolution"
                defaultValue="resolution change selection list"
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="Debit Resubmission Date"
                id="form-input-control-debitResubmissionDate"
                defaultValue="handleDebitDate"
              />
              <Form.Input
                fluid
                label="Debit Resubmission Amount"
                id="form-input-control-debitResubmissionAmount"
                defaultValue="onValueChanged debitResubmissionAmount"
              />
              <Form.Input
                fluid
                label="Pend Reason"
                id="form-input-control-pendReason"
                defaultValue="pendReason change selection list"
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="KAM Case Notes or Outcome Notes"
                id="form-input-control-outcomeNotes"
                defaultValue="handleoutcomeNotes"
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="Next Visit Date and Time"
                id="form-input-control-nextVisitDateTime"
                defaultValue="handlenextVisitDateTime"
              />
              <Form.Input
                fluid
                label="Assignment"
                id="form-input-control-currentAssignment"
                defaultValue="onValueChanged currentAssignment userList"
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="Next Steps"
                id="form-input-control-nextSteps"
                defaultValue="handlenextSteps"
              />
            </Form.Group>
          </Form>
        </Card>
      </Container>
    );
  }

  return <Container>{content}</Container>;
};

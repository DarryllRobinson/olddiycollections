import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Container, Divider, Form, Input } from 'semantic-ui-react';
import DateTime from 'react-datetime';
import moment from 'moment';

import { fetchCollection, selectCollectionById } from './collectionsSlice';
import { Outcomes } from '../outcomes/Outcomes';
import { UsersList } from '../users/UsersList';

export const Collection = (props) => {
  //console.log('props', props);
  const [state, setState] = React.useState({
    currentAssignment: '',
    debitResubmissionAmount: '',
    debitResubmissionDate: '',
    emailUsed: '',
    kamNotes: '',
    nextSteps: '',
    nextVisitDateTime: '',
    numberCalled: '',
    outcomeNotes: '',
    pendReason: '',
    ptpAmount: '',
    ptpDate: '',
    regIdStatus: '',
    resolution: '',
    transactionType: '',
  });

  const { id } = props.match.params;
  const { role } = props;
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

  function handleSubmit() {
    console.log('Current state: ', state);
  }

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

  const cipcStatusOptions = [
    { key: 'i', text: 'In Business', value: 'In Business' },
    { key: 'f', text: 'Final Deregistration', value: 'Final Deregistration' },
  ];

  const idvStatusOptions = [
    { key: 'a', text: 'Alive', value: 'Alive' },
    { key: 'd', text: 'Deceased', value: 'Deceased' },
  ];

  const cipcIdvStatus = () => {
    if (collection.customerEntity === 'Enterprise') {
      return (
        <Form.Select
          onChange={handleSelect}
          defaultValue={collection.regIdStatus}
          label="CIPC Status"
          name="regIdStatus"
          options={cipcStatusOptions}
          width="4"
        />
      );
    } else if (collection.customerEntity === 'Consumer') {
      return (
        <Form.Select
          onChange={handleSelect}
          defaultValue={collection.regIdStatus}
          label="IDV Status"
          name="regIdStatus"
          options={idvStatusOptions}
          width="4"
        />
      );
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

  const resolutionOptions = [
    {
      key: 'callback',
      text: 'Customer requested a callback',
      value: 'Customer requested a callback',
    },
    {
      key: 'info',
      text: 'Customer requested additional information',
      value: 'Customer requested additional information',
    },
    {
      key: 'payment',
      text: 'Payment already made',
      value: 'Payment already made',
    },
    { key: 'ptp', text: 'Customer made PTP', value: 'Customer made PTP' },
    {
      key: 'dispute',
      text: 'Customer disputed account',
      value: 'Customer disputed account',
    },
  ];

  const pendReasonOptions = [
    { key: '1', text: 'Pend Reason 1', value: '1' },
    { key: '2', text: 'Pend Reason 2', value: '2' },
    { key: '3', text: 'Pend Reason 3', value: '3' },
  ];

  const notesRender = () => {
    if (role !== 'kam') {
      return (
        <Form.TextArea
          id="form-input-control-outcomeNotes"
          defaultValue={state.outcomeNotes}
          label="Outcome Notes"
          required
        />
      );
    } else {
      return (
        <Form.TextArea
          id="form-input-control-kamNotes"
          defaultValue={state.kamNotes}
          label="KAM Notes"
          required
        />
      );
    }
  };

  // Handlers
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handlePTPDate = (evt) => {
    if (typeof evt !== 'string') {
      const ptpDate = moment(evt.toDate()).format('YYYY-MM-DD HH:mm:ss');
      const followup = moment(evt.toDate())
        .subtract(1, 'day')
        .set({ hour: 8, minute: 0 })
        .format('YYYY-MM-DD HH:mm:ss');

      setState({ ...state, ptpDate: ptpDate, nextVisitDateTime: followup });
    }
  };

  const handleDebitDate = (evt) => {
    if (typeof evt !== 'string') {
      const debitResubmissionDate = moment(evt.toDate()).format(
        'YYYY-MM-DD HH:mm:ss'
      );

      setState({ ...state, debitResubmissionDate: debitResubmissionDate });
    }
  };

  const handleNVTDate = (evt) => {
    if (typeof evt !== 'string') {
      const nextVisitDateTime = moment(evt.toDate()).format(
        'YYYY-MM-DD HH:mm:ss'
      );

      setState({ ...state, nextVisitDateTime: nextVisitDateTime });
    }
  };

  const handleSelect = (evt, data) => {
    const { name, value } = data;
    //console.log('name, value', name, value);
    setState({ ...state, [name]: value });
  };

  // Setting dates earlier than today as disabled for Next Date and Time
  const yesterday = DateTime.moment().subtract(1, 'day');
  const valid = function (current) {
    return current.isAfter(yesterday);
  };

  let content;

  if (collectionStatus === 'loading') {
    content = <Form loading></Form>;
  } else if (collectionStatus === 'failed') {
    content = <Form>{error}</Form>;
  } else if (collectionStatus === 'succeeded') {
    content = (
      <Container>
        <Card raised centered fluid style={{ padding: '15px' }}>
          <Card.Header>
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
                <Form.Select
                  defaultValue={collection.accountStatus}
                  fluid
                  id="form-input-control-account-status-select"
                  label="Account Status"
                  name="accountStatus"
                  onChange={handleSelect}
                  options={accountStatusList}
                  value={state.accountStatus}
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
          </Card.Content>
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
          <Form onSubmit={handleSubmit}>
            <Form.Group widths="equal">
              <Form.Select
                fluid
                id="form-input-control-transaction-type-select"
                label="Transaction Type"
                name="transactionType"
                onChange={handleSelect}
                options={transactionTypeOptions}
                placeholder="Transaction Type"
                required
                value={state.transactionType}
              />
              <Form.Input
                fluid
                id="form-input-control-numberCalled"
                name="numberCalled"
                label="Number Called"
                onChange={handleChange}
                type="number"
                value={state.numberCalled}
                required
              />
              <Form.Input
                fluid
                label="Email Used"
                id="form-input-control-emailUsed"
                name="emailUsed"
                onChange={handleChange}
                type="email"
                value={state.emailUsed}
                required
              />
              <Form.Button content="Submit" />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field control={Input} label="PTP Date" required>
                <DateTime isValidDate={valid} onChange={handlePTPDate} />
              </Form.Field>
              <Form.Input
                fluid
                label="PTP Amount"
                name="ptpAmount"
                onChange={handleChange}
                id="form-input-control-ptpAmount"
                value={state.ptpAmount}
                required
              />
              <Form.Select
                fluid
                id="form-input-control-resolution"
                label="Outcome Resolution"
                name="resolution"
                onChange={handleSelect}
                options={resolutionOptions}
                required
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                label="Debit Resubmission Date"
                required
              >
                <DateTime
                  isValidDate={valid}
                  onChange={handleDebitDate}
                  value={state.debitResubmissionDate}
                />
              </Form.Field>
              <Form.Input
                fluid
                label="Debit Resubmission Amount"
                name="debitResubmissionAmount"
                id="form-input-control-debitResubmissionAmount"
                onChange={handleChange}
                value={state.debitResubmissionAmount}
                required
              />
              <Form.Select
                fluid
                label="Pend Reason"
                name="pendReason"
                options={pendReasonOptions}
                id="form-input-control-pendReason"
                onChange={handleSelect}
                required
              />
            </Form.Group>
            <Form.Group widths="equal">{notesRender()}</Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                label="Next Visit Date and Time"
                required
              >
                <DateTime
                  isValidDate={valid}
                  onChange={handleNVTDate}
                  value={state.nextVisitDateTime}
                />
              </Form.Field>
              <Form.Input
                fluid
                label="Assignment"
                name="currentAssignment"
                id="form-input-control-currentAssignment"
                onChange={handleChange}
                value={state.currentAssignment}
                required
              />
              <UsersList handleSelect={handleSelect} />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.TextArea
                label="Next Steps"
                name="nextSteps"
                id="form-input-control-nextSteps"
                onChange={handleChange}
                value={state.nextSteps}
                required
              />
            </Form.Group>
          </Form>
        </Card>
      </Container>
    );
  }

  return <Container>{content}</Container>;
};

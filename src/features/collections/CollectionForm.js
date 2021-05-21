import React from 'react';
import { Button, Card, Form, Input, Select, TextArea } from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import moment from 'moment';

import MysqlLayer from '../../services/MysqlLayer';
import history from '../../history';
import { UsersList } from '../users/UsersList';

export const CollectionForm = (props) => {
  //console.log('CollectionForm props', props);
  const mysqlLayer = new MysqlLayer();

  const {
    currentAssignment,
    currentStatus,
    id,
    regIdStatus,
    role,
    transactionType,
    user,
  } = props;

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

  const transactionTypeOptions = [
    { key: 'a', text: 'Admin', value: 'Admin' },
    { key: 'c', text: 'Call', value: 'Call' },
    { key: 'e', text: 'Email', value: 'Email' },
  ];

  /*let userOptions = UsersList();
  const userOptionsss = [
    { key: 1, text: 'Me', value: '1' },
    { key: 2, text: 'Not me', value: '2' },
    { key: 3, text: 'Some other guy', value: '3' },
  ];
  console.log(userOptions);
  console.log(userOptionsss);*/

  // Handlers
  const handleChange = (evt) => {
    const name = evt.target.name; //.split('.')[0];
    //console.log('evt.target.name', evt.target.name);
    //console.log('name', name);
    const value = evt.target.value;
    //console.log('value', value);
    setState((prevState) => ({
      fields: {
        ...prevState.fields,
        entities: {
          ...prevState.fields.entities,
          [name]: {
            ...prevState.fields.entities[name],
            value: value,
          },
        },
      },
    }));
  };

  const setErrorMsg = (msg, name) => {
    //console.log('msg', msg);
    setState((prevState) => ({
      fields: {
        ...prevState.fields,
        entities: {
          ...prevState.fields.entities,
          [name]: {
            ...prevState.fields.entities[name],
            error: msg,
          },
        },
      },
    }));
  };

  const handlePTPDate = (event, { name, value }) => {
    const ptpDate = value; // moment(value).format('YYYY-MM-DD HH:mm:ss');
    const followupPrep = moment(value)
      .subtract(1, 'day')
      .set({ hour: 8, minute: 0 })
      .format('DD-MM-YYYY HH:mm');
    const followup = followupPrep.toString();
    //console.log('ptpDate: ', ptpDate);
    //console.log('followup: ', followup);

    setState((prevState) => ({
      fields: {
        ...prevState.fields,
        entities: {
          ...prevState.fields.entities,
          ptpDate: {
            ...prevState.fields.entities['ptpDate'],
            value: ptpDate,
          },
        },
      },
    }));

    setState((prevState) => ({
      fields: {
        ...prevState.fields,
        entities: {
          ...prevState.fields.entities,
          nextVisitDateTime: {
            ...prevState.fields.entities['nextVisitDateTime'],
            value: followup,
          },
        },
      },
    }));
  };

  const handleDate = (event, { name, value }) => {
    setState((prevState) => ({
      fields: {
        ...prevState.fields,
        entities: {
          ...prevState.fields.entities,
          [name]: {
            ...prevState.fields.entities[name],
            value: value,
          },
        },
      },
    }));
  };

  /*const handleDate = (evt) => {
    if (typeof evt !== 'string') {
      const nextVisitDateTime = evt.toDate();

      setState((prevState) => ({
        fields: {
          ...prevState.fields,
          entities: {
            ...prevState.fields.entities,
            nextVisitDateTime: {
              ...prevState.fields.entities['nextVisitDateTime'],
              value: nextVisitDateTime,
            },
          },
        },
      }));
    }
  };*/

  const handleSelect = (evt, data) => {
    const { name, value } = data;
    //console.log('name, value', name, value);
    setState((prevState) => ({
      fields: {
        ...prevState.fields,
        entities: {
          ...prevState.fields.entities,
          [name]: {
            ...prevState.fields.entities[name],
            value: value,
          },
        },
      },
    }));
  };

  const clearErrorMessages = () => {
    const fields = state.fields.ids;

    fields.forEach((field) => {
      setState((prevState) => ({
        fields: {
          ...prevState.fields,
          entities: {
            ...prevState.fields.entities,
            [field]: {
              ...prevState.fields.entities[field],
              error: null,
            },
          },
        },
      }));
    });
  };

  const cancelUpdate = () => {
    const newStatus = currentStatus === 'Locked' ? 'Open' : currentStatus;
    //console.log('newStatus', newStatus);
    const update = { id: id, currentStatus: newStatus, lockedDateTime: null };

    mysqlLayer.Put('/cases/case', update);
    history.push('/collections');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrorMessages();
    checkFields();
  };

  const checkFields = () => {
    // Check captured values for compliance
    console.log('Current state: ', state.fields.entities);

    // Transaction Type, Number Called and Email Used
    if (!state.fields.entities['transactionType'].value) {
      setErrorMsg('Please select a transaction type', 'transactionType');
    }

    if (
      state.fields.entities['transactionType'].value === 'Call' &&
      state.fields.entities['numberCalled'].value.length !== 10
    ) {
      setErrorMsg('Please provide an 10 digit phone number', 'numberCalled');
    }

    const filter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,20}$/;

    if (
      state.fields.entities['transactionType'].value === 'Email' &&
      !filter.test(state.fields.entities['emailUsed'].value)
    ) {
      setErrorMsg('Please provide a valid email address', 'emailUsed');
    }

    // PTP values
    if (
      state.fields.entities['ptpDate'].value !== '' &&
      state.fields.entities['ptpAmount'].value === ''
    )
      setErrorMsg('Please provide an amount', 'ptpAmount');

    if (
      state.fields.entities['ptpAmount'].value !== '' &&
      state.fields.entities['ptpDate'].value === ''
    )
      setErrorMsg('Please provide a date', 'ptpDate');

    // Outcome Resolution
    if (state.fields.entities['resolution'].value === '')
      setErrorMsg('Please select a resolution', 'resolution');

    // Debit Resubmission values
    if (
      state.fields.entities['debitResubmissionDate'].value !== '' &&
      state.fields.entities['debitResubmissionAmount'].value === ''
    )
      setErrorMsg('Please provide an amount', 'debitResubmissionAmount');

    if (
      state.fields.entities['debitResubmissionAmount'].value !== '' &&
      state.fields.entities['debitResubmissionDate'].value === ''
    )
      setErrorMsg('Please provide a date', 'debitResubmissionDate');

    // Next Visit Date and Time values
    if (state.fields.entities['nextVisitDateTime'].value === '')
      setErrorMsg('Please provide a date', 'nextVisitDateTime');

    // Next Steps
    if (state.fields.entities['nextSteps'].value.length < 10)
      setErrorMsg('Please provide more detailed notes', 'nextSteps');
  };

  const [state, setState] = React.useState({
    fields: {
      ids: [
        'contactPerson',
        'currentAssignment',
        'debitResubmissionAmount',
        'debitResubmissionDate',
        'emailUsed',
        'kamNotes',
        'nextSteps',
        'nextVisitDateTime',
        'numberCalled',
        'outcomeNotes',
        'pendReason',
        'ptpAmount',
        'ptpDate',
        'regIdStatus',
        'resolution',
        'transactionType',
      ],
      entities: {
        contactPerson: {
          control: Input,
          error: null,
          fluid: true,
          isError: false,
          label: 'Contact Person',
          onChange: handleChange,
          rules: [],
          type: 'text',
          value: '',
        },
        currentAssignment: {
          control: Select,
          error: null,
          fluid: true,
          isError: false,
          label: 'Current Assignment',
          onChange: handleSelect,
          options: '',
          rules: [],
          type: 'text',
          value: user,
        },
        debitResubmissionAmount: {
          control: Input,
          error: null,
          fluid: true,
          isError: false,
          label: 'Debit Resubmission Amount',
          onChange: handleChange,
          rules: [],
          type: 'text',
          value: '',
        },
        debitResubmissionDate: {
          //control: DateTime,
          error: null,
          fluid: false,
          isError: false,
          label: 'Debit Resubmission Date',
          onChange: handleDate,
          rules: [],
          type: 'text',
          value: '',
        },
        emailUsed: {
          control: Input,
          error: null,
          fluid: true,
          isError: false,
          label: 'Email Used',
          onChange: handleChange,
          rules: [],
          type: 'email',
          value: '',
        },
        kamNotes: {
          control: TextArea,
          error: null,
          fluid: 'true',
          isError: false,
          label: 'KAM Notes',
          onChange: handleChange,
          rules: [],
          type: 'text',
          value: '',
        },
        nextSteps: {
          control: TextArea,
          error: null,
          fluid: 'true',
          isError: false,
          label: 'Next Steps',
          onChange: handleChange,
          rules: [],
          type: 'text',
          value: '',
        },
        nextVisitDateTime: {
          //control: DateTime,
          error: null,
          fluid: false,
          isError: false,
          label: 'Next Visit Date and Time',
          onChange: handleDate,
          rules: [],
          type: 'text',
          value: '',
        },
        numberCalled: {
          control: Input,
          error: null,
          fluid: true,
          isError: false,
          label: 'Number Called',
          onChange: handleChange,
          rules: [],
          type: 'text',
          value: '',
        },
        outcomeNotes: {
          control: TextArea,
          error: null,
          fluid: 'true',
          isError: false,
          label: 'Outcome Notes',
          onChange: handleChange,
          rules: [],
          type: 'text',
          value: '',
        },
        pendReason: {
          control: Select,
          error: null,
          fluid: false,
          isError: false,
          label: 'Pend Reason',
          onChange: handleSelect,
          options: pendReasonOptions,
          rules: [],
          type: 'text',
          value: '',
        },
        ptpAmount: {
          control: Input,
          error: null,
          fluid: true,
          isError: false,
          label: 'PTP Amount',
          onChange: handleChange,
          rules: [],
          type: 'text',
          value: '',
        },
        ptpDate: {
          //control: DateTime,
          error: null,
          fluid: false,
          isError: false,
          label: 'PTP Date',
          onChange: handlePTPDate,
          rules: [],
          type: 'text',
          value: '',
        },
        regIdStatus: {
          control: Select,
          error: null,
          fluid: false,
          isError: false,
          label: 'Registration / ID Status',
          onChange: handleSelect,
          rules: [],
          type: 'text',
          value: '',
        },
        resolution: {
          control: Select,
          error: null,
          fluid: false,
          isError: false,
          label: 'Resolution',
          onChange: handleSelect,
          options: resolutionOptions,
          rules: [],
          type: 'text',
          value: '',
        },
        transactionType: {
          control: Select,
          error: null,
          fluid: false,
          isError: false,
          label: 'Transaction Type',
          onChange: handleSelect,
          options: transactionTypeOptions,
          rules: [],
          type: 'text',
          value: '',
        },
      },
    },
  });

  // Setting dates earlier than today as disabled for all date pickers
  const today = new Date();

  return (
    <Card fluid>
      <Form>
        <Form.Group widths="equal">
          <Form.Field
            control={Select}
            error={state.fields.entities['transactionType'].error}
            fluid
            id="form-input-control-transaction-type-select"
            label="Transaction Type"
            name="transactionType"
            onChange={handleSelect}
            options={transactionTypeOptions}
            required
            value={state.fields.entities['transactionType'].value}
          />
          <Form.Input
            fluid
            error={state.fields.entities['numberCalled'].error}
            id="form-input-control-numberCalled"
            name="numberCalled"
            label="Number Called"
            onChange={handleChange}
            type="text"
            value={state.fields.entities['numberCalled'].value}
          />
          <Form.Input
            fluid
            error={state.fields.entities['emailUsed'].error}
            label="Email Used"
            id="form-input-control-emailUsed"
            name="emailUsed"
            onChange={handleChange}
            type="email"
            value={state.fields.entities['emailUsed'].value}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            error={state.fields.entities['ptpDate'].error}
            label="PTP Date"
            name="ptpDate"
          >
            <DateTimeInput
              closable
              minDate={today}
              name="ptpDate"
              placeholder="PTP Date"
              value={state.fields.entities['ptpDate'].value}
              iconPosition="left"
              onChange={handlePTPDate}
            />
          </Form.Field>
          <Form.Input
            error={state.fields.entities['ptpAmount'].error}
            fluid
            label="PTP Amount"
            name="ptpAmount"
            onChange={handleChange}
            id="form-input-control-ptpAmount"
            type="number"
            value={state.fields.entities['ptpAmount'].value}
          />
          <Form.Select
            error={state.fields.entities['resolution'].error}
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
            error={state.fields.entities['debitResubmissionDate'].error}
            label="Debit Resubmission Date"
            name="debitResubmissionDate"
          >
            <DateTimeInput
              closable
              minDate={today}
              name="debitResubmissionDate"
              placeholder="Debit Resubmission Date"
              value={state.fields.entities['debitResubmissionDate'].value}
              iconPosition="left"
              onChange={handleDate}
            />
          </Form.Field>
          <Form.Input
            error={state.fields.entities['debitResubmissionAmount'].error}
            fluid
            label="Debit Resubmission Amount"
            name="debitResubmissionAmount"
            id="form-input-control-debitResubmissionAmount"
            onChange={handleChange}
            type="number"
            value={state.fields.entities['debitResubmissionAmount'].value}
          />
          <Form.Select
            error={state.fields.entities['pendReason'].error}
            fluid
            label="Pend Reason"
            name="pendReason"
            options={pendReasonOptions}
            id="form-input-control-pendReason"
            onChange={handleSelect}
          />
          <Button content="Submit" onClick={handleSubmit} />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            error={state.fields.entities['nextVisitDateTime'].error}
            label="Next Visit Date and Time"
          >
            <DateTimeInput
              closable
              minDate={today}
              name="nextVisitDateTime"
              placeholder="Next Visit Date and Time"
              value={state.fields.entities['nextVisitDateTime'].value}
              iconPosition="left"
              onChange={handleDate}
            />
          </Form.Field>
          <UsersList handleSelect={handleSelect} user={user} />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.TextArea
            error={state.fields.entities['nextSteps'].error}
            label="Next Steps"
            name="nextSteps"
            id="form-input-control-nextSteps"
            onChange={handleChange}
            value={state.fields.entities['nextSteps'].value}
            required
          />
        </Form.Group>
        <Form.Group widths="equal"></Form.Group>
        <Card>
          <Button content="Submit" onClick={handleSubmit} />
          <Button content="Pend" onClick={handleSubmit} />
          <Button content="Cancel" onClick={cancelUpdate} />
          <Button content="Close" onClick={handleSubmit} />
        </Card>
      </Form>
    </Card>
  );
};

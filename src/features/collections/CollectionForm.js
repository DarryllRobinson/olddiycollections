import React from 'react';
import {
  Button,
  Container,
  Form,
  Input,
  Select,
  TextArea,
} from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import moment from 'moment';

import MysqlLayer from '../../services/MysqlLayer';
import history from '../../history';
import { UsersList } from '../users/UsersList';
//import { ProgressBar } from '../../utils/ProgressBar';

export const CollectionForm = (props) => {
  // Scroll to top
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  //console.log('CollectionForm props', props);
  const mysqlLayer = new MysqlLayer();

  const {
    accountNumber,
    caseNotes,
    caseStatus,
    currentAssignment,
    currentStatus,
    id,
    kamNotes,
    role,
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
    const ptpDate = value;
    const followup = moment(value)
      .subtract(1, 'days')
      .set({ hour: 8, minute: 0 })
      .format('YYYY-MM-DD HH:mm');

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
    console.log('newStatus', newStatus);
    const update = { currentStatus: newStatus, lockedDateTime: null };

    mysqlLayer.Put(`/cases/case/${id}`, update);
    history.push({
      pathname: '/collections',
      state: { caseStatus: caseStatus },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrorMessages();
    if (checkFields()) updateDatabase();
  };

  const checkFields = () => {
    let cont = true;
    // Check captured values for compliance
    console.log('Current state: ', state.fields.entities);

    // Transaction Type, Number Called and Email Used
    if (!state.fields.entities['transactionType'].value) {
      setErrorMsg('Please select a transaction type', 'transactionType');
      cont = false;
    }

    if (
      state.fields.entities['transactionType'].value === 'Call' &&
      state.fields.entities['numberCalled'].value.length !== 10
    ) {
      setErrorMsg('Please provide an 10 digit phone number', 'numberCalled');
      cont = false;
    }

    const filter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,20}$/;

    if (
      state.fields.entities['transactionType'].value === 'Email' &&
      !filter.test(state.fields.entities['emailUsed'].value)
    ) {
      setErrorMsg('Please provide a valid email address', 'emailUsed');
      cont = false;
    }

    // PTP values
    if (
      state.fields.entities['ptpDate'].value !== '' &&
      state.fields.entities['ptpAmount'].value === ''
    ) {
      setErrorMsg('Please provide an amount', 'ptpAmount');
      cont = false;
    }

    if (
      state.fields.entities['ptpAmount'].value !== '' &&
      state.fields.entities['ptpDate'].value === ''
    ) {
      setErrorMsg('Please provide a date', 'ptpDate');
      cont = false;
    }

    // Outcome Resolution
    if (state.fields.entities['resolution'].value === '') {
      setErrorMsg('Please select a resolution', 'resolution');
      cont = false;
    }

    // Debit Resubmission values
    if (
      state.fields.entities['debitResubmissionDate'].value !== '' &&
      state.fields.entities['debitResubmissionAmount'].value === ''
    ) {
      setErrorMsg('Please provide an amount', 'debitResubmissionAmount');
      cont = false;
    }

    if (
      state.fields.entities['debitResubmissionAmount'].value !== '' &&
      state.fields.entities['debitResubmissionDate'].value === ''
    ) {
      setErrorMsg('Please provide a date', 'debitResubmissionDate');
      cont = false;
    }

    // Outcome or KAM Notes
    if (
      role === 'admin' &&
      state.fields.entities['outcomeNotes'].value.length < 10
    ) {
      setErrorMsg('Please provide more detailed notes', 'outcomeNotes');
      cont = false;
    }

    if (
      role === 'agent' &&
      state.fields.entities['outcomeNotes'].value.length < 10
    ) {
      setErrorMsg('Please provide more detailed notes', 'outcomeNotes');
      cont = false;
    }

    if (role === 'kam' && state.fields.entities['kamNotes'].value.length < 10) {
      setErrorMsg('Please provide more detailed notes', 'kamNotes');
      cont = false;
    }

    // Next Visit Date and Time values
    if (state.fields.entities['nextVisitDateTime'].value === '') {
      setErrorMsg('Please provide a date', 'nextVisitDateTime');
      cont = false;
    }

    // Next Steps
    if (state.fields.entities['nextSteps'].value.length < 10) {
      setErrorMsg('Please provide more detailed notes', 'nextSteps');
      cont = false;
    }

    return cont;
  };

  const [state, setState] = React.useState({
    fields: {
      ids: [
        'contactPerson',
        'currentAssignment',
        'debitResubmissionAmount',
        'debitResubmissionDate',
        'emailUsed',
        'newCaseNotes',
        'newKamNotes',
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
          DateTimeInput,
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
        newCaseNotes: {
          control: TextArea,
          error: null,
          isError: false,
          label: 'New Case Notes',
          onChange: handleChange,
          rules: [],
          type: 'text',
          value: '',
        },
        newKamNotes: {
          control: TextArea,
          error: null,
          isError: false,
          label: 'New KAM Notes',
          onChange: handleChange,
          rules: [],
          type: 'text',
          value: '',
        },
        nextSteps: {
          control: TextArea,
          error: null,
          isError: false,
          label: 'Next Steps',
          onChange: handleChange,
          rules: [],
          type: 'text',
          value: '',
        },
        nextVisitDateTime: {
          DateTimeInput,
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
          DateTimeInput,
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

  const updateDatabase = async (process) => {
    let newCaseNote;
    let newKamNote;
    let newOutcomeNote;

    if (state.fields.entities['newKamNotes'].value !== '') {
      newKamNote =
        `${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')} by ${user}\n${
          state.fields.entities['newKamNotes'].value
        }\n\r` + kamNotes;

      if (state.fields.entities['newCaseNotes'].value === '')
        state.fields.entities['newCaseNotes'].value = 'KAM notes updated';
    }

    if (state.fields.entities['newCaseNotes'].value !== '') {
      newCaseNote =
        `${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')} by ${user}\n${
          state.fields.entities['newCaseNotes'].value
        }\n\r` + caseNotes;
    }

    newOutcomeNote = `${moment(new Date()).format(
      'YYYY-MM-DD HH:mm:ss'
    )} by ${user}\n${state.fields.entities['outcomeNotes'].value}\n\r`;

    const closedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const closedBy = user;

    let caseUpdate;
    // Working out which role for notes and what action has been submitted
    if (process === 'Closed' && newKamNote !== '' && newCaseNote !== '') {
      caseUpdate = {
        currentStatus: process,
        caseNotes: newCaseNote,
        kamNotes: newKamNote,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };
    } else if (
      process === 'Closed' &&
      newKamNote !== '' &&
      newCaseNote === ''
    ) {
      caseUpdate = {
        currentStatus: process,
        kamNotes: newKamNote,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };
    } else if (
      process === 'Closed' &&
      newKamNote === '' &&
      newCaseNote !== ''
    ) {
      caseUpdate = {
        currentStatus: process,
        caseNotes: newCaseNote,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };
    } else if (
      process === 'Closed' &&
      newKamNote === '' &&
      newCaseNote === ''
    ) {
      caseUpdate = {
        currentStatus: process,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };
    } else if (
      process !== 'Closed' &&
      newKamNote !== '' &&
      newCaseNote !== ''
    ) {
      caseUpdate = {
        currentAssignment: currentAssignment,
        currentStatus: process,
        caseNotes: newCaseNote,
        kamNotes: newKamNote,
        nextVisitDateTime: state.fields.entities['nextVisitDateTime'].value,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };
    } else if (
      process !== 'Closed' &&
      newKamNote !== '' &&
      newCaseNote === ''
    ) {
      caseUpdate = {
        currentAssignment: currentAssignment,
        currentStatus: process,
        kamNotes: newKamNote,
        nextVisitDateTime: state.fields.entities['nextVisitDateTime'].value,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };
    } else if (
      process !== 'Closed' &&
      newKamNote === '' &&
      newCaseNote !== ''
    ) {
      caseUpdate = {
        currentAssignment: currentAssignment,
        currentStatus: process,
        caseNotes: newCaseNote,
        nextVisitDateTime: state.fields.entities['nextVisitDateTime'].value,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };
    } else if (
      process !== 'Closed' &&
      newKamNote === '' &&
      newCaseNote === ''
    ) {
      caseUpdate = {
        currentAssignment: currentAssignment,
        currentStatus: process,
        nextVisitDateTime: state.fields.entities['nextVisitDateTime'].value,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };
    }

    let outcomeInsert;
    let accountUpdate;

    // Working out PTP and Debit Resubmission arrangement
    if (
      !state.fields.entities['ptpDate'].value &&
      !state.fields.entities['debitResubmissionDate'].value
    ) {
      accountUpdate = {
        //accountStatus: this.state.accountStatus,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };

      outcomeInsert = {
        createdBy: user,
        outcomeStatus: 'Closed',
        transactionType: state.fields.entities['transactionType'].value,
        numberCalled: state.fields.entities['numberCalled'].value,
        emailUsed: state.fields.entities['emailUsed'].value,
        contactPerson: state.fields.entities['contactPerson'].value,
        outcomeResolution: state.fields.entities['resolution'].value,
        outcomeNotes: newOutcomeNote,
        nextSteps: state.fields.entities['nextSteps'].value,
        closedDate: closedDate,
        closedBy: closedBy,
        f_caseId: id,
      };
    } else if (
      state.fields.entities['ptpDate'].value &&
      !state.fields.entities['debitResubmissionDate'].value
    ) {
      accountUpdate = {
        //accountStatus: this.state.accountStatus,
        lastPTPDate: state.fields.entities['ptpDate'].value,
        lastPTPAmount: state.fields.entities['ptpAmount'].value,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };

      outcomeInsert = {
        createdBy: user,
        outcomeStatus: 'Closed',
        transactionType: state.fields.entities['transactionType'].value,
        numberCalled: state.fields.entities['numberCalled'].value,
        emailUsed: state.fields.entities['emailUsed'].value,
        contactPerson: state.fields.entities['contactPerson'].value,
        outcomeResolution: state.fields.entities['resolution'].value,
        outcomeNotes: newOutcomeNote,
        ptpDate: state.fields.entities['ptpDate'].value,
        ptpAmount: state.fields.entities['ptpAmount'].value,
        nextSteps: state.fields.entities['nextSteps'].value,
        closedDate: closedDate,
        closedBy: closedBy,
        f_caseId: id,
      };
    } else if (
      !state.fields.entities['ptpDate'].value &&
      state.fields.entities['debitResubmissionDate'].value
    ) {
      accountUpdate = {
        //accountStatus: this.state.accountStatus,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };

      outcomeInsert = {
        createdBy: user,
        outcomeStatus: 'Closed',
        transactionType: state.fields.entities['transactionType'].value,
        numberCalled: state.fields.entities['numberCalled'].value,
        emailUsed: state.fields.entities['emailUsed'].value,
        contactPerson: state.fields.entities['contactPerson'].value,
        outcomeResolution: state.fields.entities['resolution'].value,
        outcomeNotes: newOutcomeNote,
        nextSteps: state.fields.entities['nextSteps'].value,
        closedDate: closedDate,
        closedBy: closedBy,
        debitResubmissionAmount:
          state.fields.entities['debitResubmissionAmount'].value,
        debitResubmissionDate:
          state.fields.entities['debitResubmissionDate'].value,
        f_caseId: id,
      };
    } else if (
      state.fields.entities['ptpDate'].value &&
      state.fields.entities['debitResubmissionDate'].value
    ) {
      accountUpdate = {
        //accountStatus: this.state.accountStatus,
        lastPTPDate: state.fields.entities['ptpDate'].value,
        lastPTPAmount: state.fields.entities['ptpAmount'].value,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };

      outcomeInsert = {
        createdBy: user,
        outcomeStatus: 'Closed',
        transactionType: state.fields.entities['transactionType'].value,
        numberCalled: state.fields.entities['numberCalled'].value,
        emailUsed: state.fields.entities['emailUsed'].value,
        contactPerson: state.fields.entities['contactPerson'].value,
        outcomeResolution: state.fields.entities['resolution'].value,
        outcomeNotes: newOutcomeNote,
        ptpDate: state.fields.entities['ptpDate'].value,
        ptpAmount: state.fields.entities['ptpAmount'].value,
        nextSteps: state.fields.entities['nextSteps'].value,
        closedDate: closedDate,
        closedBy: closedBy,
        debitResubmissionAmount:
          state.fields.entities['debitResubmissionAmount'].value,
        debitResubmissionDate:
          state.fields.entities['debitResubmissionDate'].value,
        f_caseId: id,
      };
    }

    console.log('Sending updates');
    mysqlLayer.Put(`/accounts/account/${accountNumber}`, accountUpdate);
    mysqlLayer.Put(`/cases/case/${id}`, caseUpdate);
    const outcomeStatus = await mysqlLayer.Post(
      `/outcomes/outcome/${id}`,
      outcomeInsert
    );
    if (outcomeStatus.status === 'Ok') {
      history.push({
        pathname: '/collections',
        state: { caseStatus: caseStatus },
      });
    } else {
      console.log(outcomeStatus);
    }
  };

  // Setting dates earlier than today as disabled for all date pickers
  const today = new Date();

  return (
    <Container>
      <Form>
        {role === 'kam' && (
          <Form.Group widths="equal">
            <Form.TextArea
              error={state.fields.entities['newKamNotes'].error}
              id="form-input-control-newKamNotes"
              name="newKamNotes"
              label="New KAM Note"
              onChange={handleChange}
              type="text"
              value={state.fields.entities['newKamNotes'].value}
            />
          </Form.Group>
        )}
        <Form.Group widths="equal">
          <Form.TextArea
            error={state.fields.entities['newCaseNotes'].error}
            id="form-input-control-newCaseNotes"
            name="newCaseNotes"
            label="New Case Note"
            onChange={handleChange}
            type="text"
            value={state.fields.entities['newCaseNotes'].value}
          />
        </Form.Group>
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
          <Form.Input
            error={state.fields.entities['ptpDate'].error}
            input={
              <DateTimeInput
                closable
                dateTimeFormat="YYYY-MM-DD HH:mm:ss"
                minDate={today}
                name="ptpDate"
                placeholder="PTP Date"
                value={state.fields.entities['ptpDate'].value}
                iconPosition="left"
                onChange={handlePTPDate}
              />
            }
            label="PTP Date"
            name="ptpDate"
          />
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
          <Form.Input
            error={state.fields.entities['debitResubmissionDate'].error}
            input={
              <DateTimeInput
                closable
                dateTimeFormat="YYYY-MM-DD HH:mm:ss"
                minDate={today}
                name="debitResubmissionDate"
                placeholder="Debit Resubmission Date"
                value={state.fields.entities['debitResubmissionDate'].value}
                iconPosition="left"
                onChange={handleDate}
              />
            }
            label="Debit Resubmission Date"
            name="debitResubmissionDate"
          />
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
        </Form.Group>
        <Form.Group widths="equal">
          <Form.TextArea
            error={state.fields.entities['outcomeNotes'].error}
            label="Outcome Notes"
            name="outcomeNotes"
            id="form-input-control-outcomeNotes"
            onChange={handleChange}
            value={state.fields.entities['outcomeNotes'].value}
            required
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            error={state.fields.entities['nextVisitDateTime'].error}
            input={
              <DateTimeInput
                closable
                dateTimeFormat="YYYY-MM-DD HH:mm:ss"
                minDate={today}
                name="nextVisitDateTime"
                placeholder="Next Visit Date and Time"
                value={state.fields.entities['nextVisitDateTime'].value}
                iconPosition="left"
                onChange={handleDate}
              />
            }
            label="Next Visit Date and Time"
            required
          />
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
        <Container fluid textAlign="center">
          <Button.Group size="large">
            <Button content="Submit" onClick={handleSubmit} />
            <Button.Or />
            <Button content="Cancel" onClick={cancelUpdate} />
            <Button.Or />
            <Button content="Close" onClick={handleSubmit} />
          </Button.Group>
        </Container>
      </Form>
    </Container>
  );
};

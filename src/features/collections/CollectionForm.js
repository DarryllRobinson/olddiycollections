import React from 'react';
import { Button, Card, Form, Input, Select } from 'semantic-ui-react';
import DateTime from 'react-datetime';
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

  /*this.setState(prevState => ({
  food: {
    ...prevState.food,           // copy all other key-value pairs of food object
    pizza: {                     // specific object of food object
      ...prevState.food.pizza,   // copy all pizza key-value pairs
      extraCheese: true          // update value of specific key
    }
  }
}))*/

  const [state, setState] = React.useState({
    fields: {
      ids: [
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
      ],
      entities: {
        contactPerson: {
          error: '',
          isError: false,
          rules: [],
          value: '',
        },
        currentAssignment: {
          error: '',
          isError: false,
          rules: [],
          value: '',
        },
        debitResubmissionAmount: {
          error: '',
          isError: false,
          rules: [],
          value: '',
        },
        debitResubmissionDate: {
          error: '',
          isError: false,
          rules: [],
          value: '',
        },
        emailUsed: {
          error: '',
          isError: false,
          rules: [],
          value: '',
        },
        kamNotes: {
          error: '',
          isError: false,
          rules: [],
          value: '',
        },
        nextSteps: {
          error: '',
          isError: false,
          rules: [],
          value: '',
        },
        nextVisitDateTime: {
          error: '',
          isError: false,
          rules: [],
          value: '',
        },
        numberCalled: {
          error: '',
          isError: false,
          rules: [],
          value: '123',
        },
        outcomeNotes: {
          error: '',
          isError: false,
          rules: [],
          value: '',
        },
        pendReason: {
          error: '',
          isError: false,
          rules: [],
          value: '',
        },
        ptpAmount: {
          error: '',
          isError: false,
          rules: [],
          value: '',
        },
        ptpDate: {
          error: '',
          isError: false,
          rules: [],
          value: '',
        },
        regIdStatus: {
          error: '',
          isError: false,
          rules: [],
          value: '',
        },
        resolution: {
          error: '',
          isError: false,
          rules: [],
          value: '',
        },
        transactionType: {
          error: '',
          isError: false,
          rules: [],
          value: '',
        },
      },
    },
  });

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

  // Handlers
  const handleChange = (evt) => {
    const name = evt.target.name; //.split('.')[0];
    console.log('evt.target.name', evt.target.name);
    console.log('name', name);
    const value = evt.target.value;
    console.log('value', value);
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

  const cancelUpdate = () => {
    const newStatus = currentStatus === 'Locked' ? 'Open' : currentStatus;
    //console.log('newStatus', newStatus);
    const update = { id: id, currentStatus: newStatus, lockedDateTime: null };

    mysqlLayer.Put('/cases/case', update);
    history.push('/collections');
  };

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Current state: ', state);
  }

  // Setting dates earlier than today as disabled for Next Date and Time
  const yesterday = DateTime.moment().subtract(1, 'day');
  const valid = function (current) {
    return current.isAfter(yesterday);
  };

  return (
    <Card fluid>
      <Form>
        <Form.Group widths="equal">
          <Form.Field
            control={Select}
            fluid
            id="form-input-control-transaction-type-select"
            label="Transaction Type"
            name="state.fields.entities['transactionType'].value"
            onChange={handleSelect}
            options={transactionTypeOptions}
            placeholder="Transaction Type"
            required
            value={state.fields.entities['transactionType'].value}
          />
          <Form.Input
            fluid
            id="form-input-control-numberCalled"
            name="numberCalled"
            label="Number Called"
            onChange={handleChange}
            type="text"
            value={state.fields.entities.numberCalled.value}
            required
          />
          <div>numberCalled: {state.fields.entities.numberCalled.value}</div>
          <Button type="submit">Submit</Button>
          <Form.Input
            fluid
            label="Email Used"
            id="form-input-control-emailUsed"
            name="emailUsed"
            onChange={handleChange}
            type="email"
            value={state.fields.entities['emailUsed'].value}
            required
          />
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
            value={state.fields.entities['ptpAmount'].value}
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
          <Form.Field control={Input} label="Debit Resubmission Date" required>
            <DateTime
              isValidDate={valid}
              onChange={handleDebitDate}
              value={state.fields.entities['debitResubmissionDate'].value}
            />
          </Form.Field>
          <Form.Input
            fluid
            label="Debit Resubmission Amount"
            name="debitResubmissionAmount"
            id="form-input-control-debitResubmissionAmount"
            onChange={handleChange}
            value={state.fields.entities['debitResubmissionAmount'].value}
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
        <Form.Group widths="equal">
          <Form.Field control={Input} label="Next Visit Date and Time" required>
            <DateTime
              isValidDate={valid}
              onChange={handleNVTDate}
              value={state.fields.entities['nextVisitDateTime'].value}
            />
          </Form.Field>
          <UsersList handleSelect={handleSelect} user={user} />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.TextArea
            label="Next Steps"
            name="nextSteps"
            id="form-input-control-nextSteps"
            onChange={handleChange}
            value={state.fields.entities['nextSteps'].value}
            required
          />
        </Form.Group>
        <Form.Group widths="equal"></Form.Group>
      </Form>
    </Card>
  );
};

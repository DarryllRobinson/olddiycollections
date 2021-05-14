import React from 'react';
import { Button, Card, Form, Input, Select, TextArea } from 'semantic-ui-react';
import DateTime from 'react-datetime';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import MysqlLayer from '../../services/MysqlLayer';
import history from '../../history';
import { fetchUsers, selectAllUsers } from '../users/usersSlice';

export const CollectionForm = (props) => {
  //console.log('CollectionForm props', props);
  const mysqlLayer = new MysqlLayer();

  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);

  const userStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  React.useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  let userOptions = [];
  if (userStatus === 'loading') {
    userOptions.push([{ key: 1, text: 'Loading', value: 'Loading' }]);
  }
  if (userStatus === 'succeeded') {
    users.map((user) =>
      userOptions.push({
        key: user.id,
        text: user.firstName,
        value: user.email,
      })
    );
    console.log('userOptions: ', userOptions);
  }

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

  const cancelUpdate = () => {
    const newStatus = currentStatus === 'Locked' ? 'Open' : currentStatus;
    //console.log('newStatus', newStatus);
    const update = { id: id, currentStatus: newStatus, lockedDateTime: null };

    mysqlLayer.Put('/cases/case', update);
    history.push('/collections');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Current state: ', state);
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
      ],
      entities: {
        contactPerson: {
          control: Input,
          error: '',
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
          error: '',
          fluid: true,
          isError: false,
          label: 'Current Assignment',
          onChange: handleSelect,
          options: userOptions,
          rules: [],
          type: 'text',
          value: user,
        },
        debitResubmissionAmount: {
          control: Input,
          error: '',
          fluid: true,
          isError: false,
          label: 'Debit Resubmission Amount',
          onChange: handleChange,
          rules: [],
          type: 'text',
          value: '',
        },
        debitResubmissionDate: {
          control: DateTime,
          error: '',
          fluid: false,
          isError: false,
          label: 'Debit Resubmission Date',
          onChange: handleDebitDate,
          rules: [],
          type: 'text',
          value: '',
        },
        emailUsed: {
          control: Input,
          error: '',
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
          error: '',
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
          error: '',
          fluid: 'true',
          isError: false,
          label: 'Next Steps',
          onChange: handleChange,
          rules: [],
          type: 'text',
          value: '',
        },
        nextVisitDateTime: {
          control: DateTime,
          error: '',
          fluid: false,
          isError: false,
          label: 'Next Visit Date and Time',
          onChange: handleNVTDate,
          rules: [],
          type: 'text',
          value: '',
        },
        numberCalled: {
          control: Input,
          error: '',
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
          error: '',
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
          error: '',
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
          error: '',
          fluid: true,
          isError: false,
          label: 'PTP Amount',
          onChange: handleChange,
          rules: [],
          type: 'text',
          value: '',
        },
        ptpDate: {
          control: DateTime,
          error: '',
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
          error: '',
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
          error: '',
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
          error: '',
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

  // Setting dates earlier than today as disabled for Next Date and Time
  const yesterday = DateTime.moment().subtract(1, 'day');
  const valid = function (current) {
    return current.isAfter(yesterday);
  };
  const fields = state.fields.ids;
  //console.log('fields', fields);

  const formField = fields.map((field, idx) => {
    const {
      control,
      error,
      fluid,
      isError,
      label,
      onChange,
      options,
      rules,
      type,
      value,
    } = state.fields.entities[field];

    //console.log('formField options:', options);

    let formSegment;
    let fieldOrder = [];

    switch (control) {
      case Input:
        formSegment = (
          <Form.Field
            key={idx}
            control={control}
            fluid={fluid}
            label={label}
            name={field}
            onChange={onChange}
            type={type}
            value={value}
            width={8}
          />
        );
        break;
      case Select:
        formSegment = (
          <Form.Field
            key={idx}
            control={control}
            fluid={fluid}
            label={label}
            name={field}
            onChange={onChange}
            options={options}
            type={type}
            value={value}
            width={8}
          />
        );
        break;
      case TextArea:
        formSegment = (
          <Form.Field
            key={idx}
            control={control}
            fluid={fluid}
            label={label}
            name={field}
            onChange={onChange}
            options={options}
            type={type}
            value={value}
            width={8}
          />
        );
        break;
      case DateTime:
        formSegment = (
          <Form.Field key={idx} control={Input} label={label}>
            <DateTime
              isValidDate={valid}
              onChange={handleNVTDate}
              value={state.fields.entities['nextVisitDateTime'].value}
            />
          </Form.Field>
        );
        break;
      default:
    }

    if ((idx) === 0) {
      formSegment = (
        <Form.Group widths="equal">
      ) && formSegment
    } else if (idx%3 === 0 && idx > 0) {
      formSegment = formSegment &&
        </Form.Group>
      
    }
    return formSegment;
  });

  return (
    <Card fluid>
      <Form>
        <Form.Group>{formField}</Form.Group>
      </Form>
    </Card>
  );

  /*return (
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
            value={state.fields.entities['numberCalled'].value}
            required
          />
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
  );*/
};

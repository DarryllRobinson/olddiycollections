import React from 'react';
import { Button, Container, Form } from 'semantic-ui-react';
import bcrypt from 'bcryptjs';
import moment from 'moment';

import MysqlLayer from '../../services/MysqlLayer';
const mysqlLayer = new MysqlLayer();

export const AddUserForm = (props) => {
  const { loadUsers } = props;
  const [state, setState] = React.useState({
    fields: {
      ids: [
        'firstName',
        'surname',
        'email',
        'phone',
        'password',
        'role',
        'f_clientId',
      ],
      entities: {
        firstName: { error: null, value: '' },
        surname: { error: null, value: '' },
        email: { error: null, value: '' },
        phone: { error: null, value: '' },
        password: { error: null, value: '' },
        role: { error: null, value: '' },
        f_clientId: { error: null, value: '1' },
      },
    },
  });

  const roles = [
    { key: 1, text: 'Agent', value: 'agent' },
    { key: 2, text: 'KAM', value: 'kam' },
  ];

  // Handlers
  const handleChange = (evt) => {
    const name = evt.target.name;
    const value = evt.target.value;
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

  const handleCancel = () => {
    setState({
      fields: {
        ids: [
          'firstName',
          'surname',
          'email',
          'phone',
          'password',
          'role',
          'f_clientId',
        ],
        entities: {
          firstName: { error: null, value: '' },
          surname: { error: null, value: '' },
          email: { error: null, value: '' },
          phone: { error: null, value: '' },
          password: { error: null, value: '' },
          role: { error: null, value: '' },
          f_clientId: { error: null, value: '1' },
        },
      },
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrorMessages();
    if (checkFields()) updateDatabase();
  };

  const checkFields = () => {
    let cont = true;

    if (!state.fields.entities['firstName'].value) {
      setErrorMsg('Please provide a first name', 'firstName');
      cont = false;
    }

    if (!state.fields.entities['surname'].value) {
      setErrorMsg('Please provide a surname', 'surname');
      cont = false;
    }

    const filter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,20}$/;

    if (!filter.test(state.fields.entities['email'].value)) {
      setErrorMsg('Please provide a valid email address', 'email');
      cont = false;
    }

    if (state.fields.entities['password'].value.length < 8) {
      setErrorMsg(
        'Please provide a password of at least 8 characters',
        'password'
      );
      cont = false;
    }

    const numberFilter = /^[0-9]+$/;

    if (!numberFilter.test(state.fields.entities['phone'].value)) {
      setErrorMsg('Please numbers only', 'phone');
      cont = false;
    }
    if (state.fields.entities['phone'].value.length !== 10) {
      setErrorMsg('Please provide an 10 digit phone number', 'phone');
      cont = false;
    }

    if (!state.fields.entities['role'].value) {
      setErrorMsg('Please provide a role', 'role');
      cont = false;
    }

    return cont;
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

  const updateDatabase = async () => {
    const createdDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    const salt = bcrypt.genSaltSync(10);
    bcrypt.hash(state.fields.entities['password'].value, salt, (err, hash) => {
      const user = {
        firstName: state.fields.entities['firstName'].value,
        surname: state.fields.entities['surname'].value,
        email: state.fields.entities['email'].value,
        password: hash,
        phone: state.fields.entities['phone'].value,
        role: state.fields.entities['role'].value,
        f_clientId: state.fields.entities['f_clientId'].value,
        active: 1,
        createdDate: createdDate,
      };

      mysqlLayer
        .Post('/users/user', user)
        .then((response) => {
          console.log('response: ', response);
          if (response === 'user exists') {
            let message =
              'User already exists. Please create a new username (email).';
            //this.handleFailedReg(message);
            console.log('duplicated user message: ', message);
          } else if (response.affectedRows === 1) {
            //this.handleSuccessfulAuth();
            handleCancel();
            let message = 'Created!';
            console.log('success message: ', message);
            loadUsers();
          } else {
            console.log('Log error to registrationErrors');
          }
        })
        .catch((error) => {
          console.log('Registration error: ', error);
        });
    });
  };

  return (
    <Container>
      <Form>
        <Form.Group widths="equal">
          <Form.Input
            error={state.fields.entities['firstName'].error}
            id="form-input-control-firstName"
            name="firstName"
            label="First Name"
            onChange={handleChange}
            required
            type="text"
            value={state.fields.entities['firstName'].value}
          />
          <Form.Input
            error={state.fields.entities['surname'].error}
            id="form-input-control-surname"
            name="surname"
            label="Surname"
            onChange={handleChange}
            required
            type="text"
            value={state.fields.entities['surname'].value}
          />
          <Form.Input
            error={state.fields.entities['email'].error}
            id="form-input-control-email"
            name="email"
            label="Email"
            onChange={handleChange}
            required
            type="email"
            value={state.fields.entities['email'].value}
          />
        </Form.Group>

        <Form.Group widths="equal">
          <Form.Input
            error={state.fields.entities['password'].error}
            id="form-input-control-password"
            name="password"
            label="Password"
            onChange={handleChange}
            required
            type="password"
            value={state.fields.entities['password'].value}
          />
          <Form.Input
            error={state.fields.entities['phone'].error}
            id="form-input-control-phone"
            name="phone"
            label="Phone"
            onChange={handleChange}
            required
            type="text"
            value={state.fields.entities['phone'].value}
          />
          <Form.Select
            error={state.fields.entities['role'].error}
            id="form-select-control-role"
            name="role"
            label="Role"
            onChange={handleSelect}
            options={roles}
            required
            value={state.fields.entities['role'].value}
          />
        </Form.Group>
        <Button.Group size="large">
          <Button content="Submit" onClick={handleSubmit} />
          <Button.Or />
          <Button content="Cancel" onClick={handleCancel} />
        </Button.Group>
      </Form>
    </Container>
  );
};

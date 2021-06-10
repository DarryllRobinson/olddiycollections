import React from 'react';
import { Button, Container, Form } from 'semantic-ui-react';

import MysqlLayer from '../../services/MysqlLayer';
const mysqlLayer = new MysqlLayer();

export const AddUserForm = () => {
  const [state, setState] = React.useState({
    fields: {
      ids: [
        'firstName',
        'surname',
        'email',
        'phone',
        'password',
        'role',
        'clientId',
      ],
      entities: {
        firstName: { error: null, value: '' },
        surname: { error: null, value: '' },
        email: { error: null, value: '' },
        phone: { error: null, value: '' },
        password: { error: null, value: '' },
        role: { error: null, value: '' },
        clientId: { error: null, value: '1' },
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
          'clientId',
        ],
        entities: {
          firstName: { error: null, value: '' },
          surname: { error: null, value: '' },
          email: { error: null, value: '' },
          phone: { error: null, value: '' },
          password: { error: null, value: '' },
          role: { error: null, value: '' },
          clientId: { error: null, value: '1' },
        },
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submitting');
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
            type="text"
            value={state.fields.entities['firstName'].value}
          />
          <Form.Input
            error={state.fields.entities['surname'].error}
            id="form-input-control-surname"
            name="surname"
            label="Surname"
            onChange={handleChange}
            type="text"
            value={state.fields.entities['surname'].value}
          />
          <Form.Input
            error={state.fields.entities['email'].error}
            id="form-input-control-email"
            name="email"
            label="Email"
            onChange={handleChange}
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
            type="password"
            value={state.fields.entities['password'].value}
          />
          <Form.Input
            error={state.fields.entities['phone'].error}
            id="form-input-control-phone"
            name="phone"
            label="Phone"
            onChange={handleChange}
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

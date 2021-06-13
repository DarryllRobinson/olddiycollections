import React from 'react';
import { Button, Container, Form } from 'semantic-ui-react';
import moment from 'moment';

import MysqlLayer from '../../services/MysqlLayer';
const mysqlLayer = new MysqlLayer();

export const AddClientForm = (props) => {
  const { loadClients } = props;
  const [state, setState] = React.useState({
    fields: {
      ids: ['name', 'regNum', 'email', 'phone', 'mainContact'],
      entities: {
        name: { error: null, value: '' },
        regNum: { error: null, value: '' },
        email: { error: null, value: '' },
        phone: { error: null, value: '' },
        mainContact: { error: null, value: '' },
      },
    },
  });

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

  const handleCancel = (e) => {
    e.preventDefault();
    clearState();
  };

  const clearState = () => {
    setState({
      fields: {
        ids: ['name', 'regNum', 'email', 'phone', 'mainContact'],
        entities: {
          name: { error: null, value: '' },
          regNum: { error: null, value: '' },
          email: { error: null, value: '' },
          phone: { error: null, value: '' },
          mainContact: { error: null, value: '' },
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

  const handleSubmit = (event) => {
    event.preventDefault();
    clearErrorMessages();
    if (checkFields()) updateDatabase();
  };

  const checkFields = () => {
    let cont = true;

    if (!state.fields.entities['name'].value) {
      setErrorMsg('Please provide a company name', 'firstName');
      cont = false;
    }

    if (!state.fields.entities['regNum'].value) {
      setErrorMsg('Please provide a registration number', 'regNum');
      cont = false;
    }

    const filter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,20}$/;

    if (!filter.test(state.fields.entities['email'].value)) {
      setErrorMsg('Please provide a valid email address', 'email');
      cont = false;
    }

    const numberFilter = /^[0-9]+$/;

    if (!numberFilter.test(state.fields.entities['phone'].value)) {
      setErrorMsg('Please use numbers only', 'phone');
      cont = false;
    }
    if (state.fields.entities['phone'].value.length !== 10) {
      setErrorMsg('Please provide an 10 digit phone number', 'phone');
      cont = false;
    }

    if (!state.fields.entities['mainContact'].value) {
      setErrorMsg('Please provide a main contact', 'mainContact');
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

    const client = {
      name: state.fields.entities['name'].value,
      regNum: state.fields.entities['regNum'].value,
      email: state.fields.entities['email'].value,
      phone: state.fields.entities['phone'].value,
      mainContact: state.fields.entities['mainContact'].value,
      active: 1,
      hasPaid: 1,
      createdBy: 'user',
      createdDate: createdDate,
    };

    mysqlLayer
      .Post('/clients/client', client)
      .then((response) => {
        console.log('response: ', response);
        if (response === 'client exists') {
          let message =
            'Client already exists. Please check the registration number.';
          //this.handleFailedReg(message);
          console.log('duplicated client message: ', message);
        } else if (response.affectedRows === 1) {
          //this.handleSuccessfulAuth();
          clearState();
          let message = 'Created!';
          console.log('success message: ', message);
          loadClients();
        } else {
          console.log('Log error to registrationErrors');
        }
      })
      .catch((error) => {
        console.log('Registration error: ', error);
      });
  };

  return (
    <Container>
      <Form>
        <Form.Group widths="equal">
          <Form.Input
            error={state.fields.entities['name'].error}
            id="form-input-control-client-name"
            name="name"
            label="Company Name"
            onChange={handleChange}
            required
            type="text"
            value={state.fields.entities['name'].value}
          />
          <Form.Input
            error={state.fields.entities['regNum'].error}
            id="form-input-control-client-regNum"
            name="regNum"
            label="Registration Number"
            onChange={handleChange}
            required
            type="text"
            value={state.fields.entities['regNum'].value}
          />
          <Form.Input
            error={state.fields.entities['email'].error}
            id="form-input-control-client-email"
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
            error={state.fields.entities['mainContact'].error}
            id="form-input-control-client-mainContact"
            name="mainContact"
            label="Main Contact"
            onChange={handleChange}
            required
            type="text"
            value={state.fields.entities['mainContact'].value}
          />
          <Form.Input
            error={state.fields.entities['phone'].error}
            id="form-input-control-client-phone"
            name="phone"
            label="Phone"
            onChange={handleChange}
            required
            type="text"
            value={state.fields.entities['phone'].value}
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

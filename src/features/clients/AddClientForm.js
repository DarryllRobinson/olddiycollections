import React from 'react';
import { Button, Container, Form, Icon, Image, Modal } from 'semantic-ui-react';
import moment from 'moment';
import axios from 'axios';

import MysqlLayer from '../../services/MysqlLayer';
const mysqlLayer = new MysqlLayer();
//const img = '../../../../../assets/img/mie_logo.png';

export const AddClientForm = (props) => {
  //const { loadClients } = props;
  const [uploading, setUploading] = React.useState(false);
  const [state, setState] = React.useState({
    fields: {
      ids: [
        'name',
        'regNum',
        'email',
        'phone',
        'mainContact',
        'logo',
        'colour1',
        'colour2',
        'colour3',
      ],
      entities: {
        name: { error: null, value: '' },
        regNum: { error: null, value: '' },
        email: { error: null, value: '' },
        phone: { error: null, value: '' },
        mainContact: { error: null, value: '' },
        logo: {
          error: null,
          selectedFile: 'https://react.semantic-ui.com/logo.png',
          value: '',
        },
        colour1: { error: null, value: '' },
        colour2: { error: null, value: '' },
        colour3: { error: null, value: '' },
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

  const handleLogoChange = (evt) => {
    /*console.log('handleLogoChange evt.target: ', evt.target);
    console.log('handleLogoChange evt.target.files: ', evt.target.files);
    console.log(
      'URL.createObjectURL(evt.target.files[0]): ',
      URL.createObjectURL(evt.target.files[0])
    );
    const name = evt.target.name;
    const value = evt.target.value;*/

    const logoObj = state.fields.entities['logo'];
    logoObj.selectedFile = URL.createObjectURL(evt.target.files[0]);
    logoObj.value = evt.target.value;
    setState({ ...state, logoObj });
    //console.log('logo: ', state.fields.entities['logo']);
    /*setState(
      (prevState) => ({
        fields: {
          ...prevState.fields,
          entities: {
            ...prevState.fields.entities,
            [name]: {
              ...prevState.fields.entities[name],
              selectedFile: evt.target.files,
              value: value,
            },
          },
        },
      }),
      console.log('logo: ', state.fields.entities['logo'])
    );*/
  };

  const onClickHandler = () => {
    const data = new FormData();
    const companyName = state.fields.entities['name'].value;
    if (state.fields.entities['logo'].selectedFile) {
      for (
        let i = 0;
        i < state.fields.entities['logo'].selectedFile.length;
        i++
      ) {
        data.append('file', state.fields.entities['logo'].selectedFile[i]);
      }

      axios
        .post(`http://localhost:8080/api/uploads/${companyName}`, data)
        .then((response) => {
          console.log(response); //console.log(response.config.url);
          const serverLocation = response.config.url + response.data.filename;
          console.log('serverLocation: ', serverLocation);
          //(state.fields.entities['logo'].selectedFile);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('No file');
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    clearState();
  };

  const clearState = () => {
    setState({
      fields: {
        ids: [
          'name',
          'regNum',
          'email',
          'phone',
          'mainContact',
          'logo',
          'colour1',
          'colour2',
          'colour3',
        ],
        entities: {
          name: { error: null, value: '' },
          regNum: { error: null, value: '' },
          email: { error: null, value: '' },
          phone: { error: null, value: '' },
          mainContact: { error: null, value: '' },
          logo: {
            error: null,
            selectedFile: 'https://react.semantic-ui.com/logo.png',
            value: '',
          },
          colour1: { error: null, value: '' },
          colour2: { error: null, value: '' },
          colour3: { error: null, value: '' },
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
    setUploading(true);
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
        } else if (response === 'success') {
          //this.handleSuccessfulAuth();
          clearState();
          setUploading(false);
          let message = 'Created!';
          console.log('success message: ', message);
          //loadClients();
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
      <Modal dimmer="blurring" open={uploading}>
        <Modal.Header>Creating a new client...</Modal.Header>
        <Modal.Content>Please wait...</Modal.Content>
      </Modal>
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

        <Form.Group>
          <Form.Input
            error={state.fields.entities['logo'].error}
            id="form-input-control-client-logo"
            name="logo"
            label="Logo"
            onChange={handleLogoChange}
            type="file"
            value={state.fields.entities['logo'].value}
            width={10}
          />
          <Button icon onClick={onClickHandler} labelPosition="left">
            <Icon name="upload" />
            Upload your logo
          </Button>
          <Form.Input
            error={state.fields.entities['colour1'].error}
            id="form-input-control-client-colour1"
            name="colour1"
            label="colour1"
            onChange={handleChange}
            type="text"
            value={state.fields.entities['colour1'].value}
            width={2}
          />
          <Form.Input
            error={state.fields.entities['colour2'].error}
            id="form-input-control-client-colour2"
            name="colour2"
            label="colour2"
            onChange={handleChange}
            type="text"
            value={state.fields.entities['colour2'].value}
            width={2}
          />
          <Form.Input
            error={state.fields.entities['colour3'].error}
            id="form-input-control-client-colour3"
            name="colour3"
            label="colour3"
            onChange={handleChange}
            type="text"
            value={state.fields.entities['colour3'].value}
            width={2}
          />
        </Form.Group>
        <Image
          className="demo logo"
          alt="client logo"
          disabled
          size="medium"
          src={state.fields.entities['logo'].selectedFile}
        />

        <Button.Group size="large">
          <Button content="Submit" onClick={handleSubmit} />
          <Button.Or />
          <Button content="Cancel" onClick={handleCancel} />
        </Button.Group>
      </Form>
    </Container>
  );
};

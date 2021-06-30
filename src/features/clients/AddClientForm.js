import React from 'react';
import { Button, Container, Form, Icon, Image, Modal } from 'semantic-ui-react';
import moment from 'moment';

import img from '../../assets/img/upload_logo.png';
import MysqlLayer from '../../services/MysqlLayer';
const mysqlLayer = new MysqlLayer();

export const AddClientForm = (props) => {
  //const { loadClients } = props;

  // Scroll window to top on load
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [uploading, setUploading] = React.useState(false);
  const [checkName, setCheckName] = React.useState(false);
  const [client, setClient] = React.useState({
    name: 'Disney',
    regNum: '1234',
    email: 'darryllrobinson@icloud.com',
    phone: '0123456789',
    mainContact: 'Mickeymouse',
    active: 1,
    hasPaid: 1,
    createdBy: 'user',
  });
  const [insertClient, setInsertClient] = React.useState(false);

  const [state, setState] = React.useState({
    databases: {
      ids: ['accounts', 'cases', 'contacts', 'customers', 'outcomes'],
      entities: {
        accounts: { created: false, response: null },
        cases: { created: false, response: null },
        contacts: { created: false, response: null },
        customers: { created: false, response: null },
        outcomes: { created: false, response: null },
      },
    },
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
          location: img,
          selectedFile: null,
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
    const logoObj = state.fields.entities['logo'];
    logoObj.location = URL.createObjectURL(evt.target.files[0]);
    logoObj.selectedFile = evt.target.files;
    setState({ ...state, logoObj });
  };

  const sendConfig = async () => {
    const data = new FormData();
    let logoLocation;

    if (state.fields.entities['logo'].selectedFile) {
      for (
        let i = 0;
        i < state.fields.entities['logo'].selectedFile.length;
        i++
      ) {
        data.append('file', state.fields.entities['logo'].selectedFile[i]);
      }
      data.append('name', state.fields.entities['name'].value);

      await mysqlLayer
        .Post(`/uploads`, data)
        .then((response) => {
          console.log('Location on server: ', response);
          logoLocation = response.path;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('No file');
    }

    const configPackage = {
      logoLocation,
    };

    // Send logo location to database
    await mysqlLayer.Post(`/config`, configPackage).then((response) => {
      console.log('Config response: ', response);
    });
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
            location: img,
            selectedFile: null,
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
    //setUploading(true);
    const createdDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    setClient({
      name: state.fields.entities['name'].value,
      regNum: state.fields.entities['regNum'].value,
      email: state.fields.entities['email'].value,
      phone: state.fields.entities['phone'].value,
      mainContact: state.fields.entities['mainContact'].value,
      active: 1,
      hasPaid: 1,
      createdBy: 'user',
      createdDate: createdDate,
    });

    mysqlLayer
      .Post('/clients/client', client)
      .then(async (response) => {
        console.log('response: ', response);
        if (response === 'client exists') {
          let message =
            'Client already exists. Please check the registration number.';
          //this.handleFailedReg(message);
          console.log('duplicated client message: ', message);
        } else if (response === 'success') {
          //this.handleSuccessfulAuth();
          //clearState();
          let message = 'Created!';
          console.log('success message: ', message);

          // Call config set up for logo and colours
          await sendConfig();
          setUploading(false);
          //loadClients();
        } else {
          console.log('Log error to registrationErrors');
        }
      })
      .catch((error) => {
        console.log('Registration error: ', error);
      });
  };

  const createTables = () => {
    state.databases.ids.forEach(async (database) => {
      console.log('database: ', database);

      await mysqlLayer
        .Post(`/clients/client/${database}`, client)
        .then((response) => {
          console.log(`${database} response: `, response);
        });
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
          <Button icon onClick={createTables} labelPosition="left">
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
          src={state.fields.entities['logo'].location}
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

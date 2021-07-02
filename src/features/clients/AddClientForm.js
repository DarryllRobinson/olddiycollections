import React from 'react';
import {
  Button,
  Container,
  Form,
  Grid,
  Icon,
  Image,
  Modal,
} from 'semantic-ui-react';
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
  const [warning, setWarning] = React.useState(false);
  const [warningMessage, setWarningMessage] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  /*const [client, setClient] = React.useState({
    name: 'Disney',
    regNum: '1234',
    email: 'darryllrobinson@icloud.com',
    phone: '0123456789',
    mainContact: 'Mickeymouse',
    active: 1,
    hasPaid: 1,
    createdBy: 'user',
  });*/

  const [client, setClient] = React.useState('');

  const [completed, setCompleted] = React.useState('');

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
        'background',
        'font',
        'header',
        'axisOne',
        'labelOne',
        'barOne',
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
        background: { error: null, value: '#a8abac' },
        font: { error: null, value: '#333740' },
        header: { error: null, value: '#787c82' },
        axisOne: { error: null, value: '#003d6a' },
        labelOne: { error: null, value: '#003d6a' },
        barOne: { error: null, value: '#2062ae' },
      },
    },
  });

  // Handlers
  const handleChange = (evt) => {
    const name = evt.target.name;
    const value = evt.target.value;
    setState((prevState) => ({
      databases: { ...prevState.databases },
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

    // Get state ready for upload
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
  };

  const handleLogoChange = (evt) => {
    const logoObj = state.fields.entities['logo'];
    logoObj.location = URL.createObjectURL(evt.target.files[0]);
    logoObj.selectedFile = evt.target.files;
    setState({ ...state, logoObj });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    clearState();
  };

  const clearState = () => {
    setState({
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
          'background',
          'font',
          'header',
          'axisOne',
          'labelOne',
          'barOne',
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
          background: { error: null, value: '#a8abac' },
          font: { error: null, value: '#333740' },
          header: { error: null, value: '#787c82' },
          axisOne: { error: null, value: '#003d6a' },
          labelOne: { error: null, value: '#003d6a' },
          barOne: { error: null, value: '#2062ae' },
        },
      },
    });
  };

  const clearErrorMessages = () => {
    const fields = state.fields.ids;

    fields.forEach((field) => {
      setState((prevState) => ({
        databases: { ...prevState.databases },
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setUploading(true);
    clearErrorMessages();

    if (checkFields()) {
      try {
        const created = await createClient();
        if (created) {
          //console.log('A client was successfully created');
          clearState();
          setCompleted(`${completed}\n The client was successfully created.`);
          setUploading(false);
          setSuccess(true);
        }
      } catch (error) {
        flagWarning('Major error', error);
      }
    }
  };

  const checkFields = () => {
    //console.log('Checking fields...');
    let cont = true;

    if (!state.fields.entities['name'].value) {
      setErrorMsg('Please provide a company name', 'name');
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

    if (!state.fields.entities['background'].value.length !== 7) {
      setErrorMsg('Please provide a 7 digit code', 'background');
      cont = false;
    }

    if (!state.fields.entities['font'].value) {
      setErrorMsg('Please provide a 7 digit code', 'font');
      cont = false;
    }

    if (!state.fields.entities['header'].value) {
      setErrorMsg('Please provide a 7 digit code', 'header');
      cont = false;
    }

    if (!state.fields.entities['axisOne'].value) {
      setErrorMsg('Please provide a 7 digit code', 'axisOne');
      cont = false;
    }

    if (!state.fields.entities['labelOne'].value) {
      setErrorMsg('Please provide a 7 digit code', 'labelOne');
      cont = false;
    }

    if (!state.fields.entities['barOne'].value) {
      setErrorMsg('Please provide a 7 digit code', 'barOne');
      cont = false;
    }

    if (!cont) setUploading(false);
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

  const createClient = async () => {
    const checked = await checkName();
    //console.log('checked: ', checked);
    if (checked === 'Unique') {
      const inserted = await insertClient();
      //console.log('inserted: ', inserted);
      if (inserted) {
        const created = await createTables();
        //console.log('created: ', created);
        if (created) {
          // Upload logo and styling
          // If no logo or styling provided, defaults will be used
          const configed = await createConfig();
          if (configed) return true;
        }
      }
    } else if (checked === 'Duplicate') {
      flagWarning(
        checked,
        'The client is already on the books. Please check the company name.'
      );
      return false;
    } else {
      flagWarning(checked.code, checked.sqlMessage);
      return false;
    }
  };

  const flagWarning = (serverMessage, guiMessage) => {
    setUploading(false);
    setWarning(true);
    setWarningMessage(`${serverMessage}: ${guiMessage}`);
  };

  const checkName = async () => {
    let checkedResponse;

    await mysqlLayer
      .Post('/clients/clientCheck', { name: client.name })
      .then((response) => {
        setCompleted(`${completed}\n Name checks out\n`);
        checkedResponse = response;
      });
    return checkedResponse;
  };

  const insertClient = async () => {
    /*const clientPackage = {
      name: state.fields.entities['name'].value,
      regNum: state.fields.entities['regNum'].value,
      email: state.fields.entities['email'].value,
      phone: state.fields.entities['phone'].value,
      mainContact: state.fields.entities['mainContact'].value,
      active: 1,
      hasPaid: 1,
      createdBy: 'user',
      createdDate: createdDate,
    };*/

    await mysqlLayer
      .Post('/clients/client', client)
      .then((response) => {
        //console.log('insertClient response: ', response);
        if (response.affectedRows === 1) {
          setCompleted(`${completed}\n Created client record\n`);
          client.id = response.insertId;
          setClient(client);
        } else {
          flagWarning(
            'Insert client record',
            'The client record could not be inserted.'
          );
          return false;
        }
      })
      .catch((error) => {
        console.log('Registration error: ', error);
        flagWarning('Registration error', error);
        return false;
      });
    return true;
  };

  const createTables = () => {
    let dbObject;
    //console.log('about to create tables: ', state);

    state.databases.ids.forEach(async (database) => {
      dbObject = state.databases.entities[database];
      //console.log(`${database} creation`);

      await mysqlLayer
        .Post(`/clients/client/${database}`, client)
        .then((response) => {
          //console.log(`${database} response: `, response);
          if (response.warningCount === 0) {
            setCompleted(`${completed} ${database} has been created\n`);
            dbObject.created = true;
            dbObject.response = `${database} has been created`;
            setState({ ...state, dbObject });
          } else {
            flagWarning('Create table problem', `Create table ${database}`);
            return false;
          }
        })
        .catch((error) => {
          //console.log('Create table error: ', error);
          flagWarning('Create table error', error);
          return false;
        });
    });
    return true;
  };

  const createConfig = async () => {
    const data = new FormData();

    // Logo stuff
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
        .catch((error) => {
          console.log('Create config error: ', error);
          flagWarning('Create config error', error);
          return false;
        });
    } else {
      console.log('No file - will use default logo');
      logoLocation = 'default';
    }

    // Styling stuff
    const background = state.fields.entities['background'].value;
    const font = state.fields.entities['font'].value;
    const header = state.fields.entities['header'].value;
    const axisOne = state.fields.entities['axisOne'].value;
    const labelOne = state.fields.entities['labelOne'].value;
    const barOne = state.fields.entities['barOne'].value;

    const configPackage = {
      logoLocation,
      background,
      font,
      header,
      axisOne,
      labelOne,
      barOne,
      f_clientId: client.id,
    };

    // Send config to database
    await mysqlLayer
      .Post(`/clients/client/config`, configPackage)
      .then((response) => {
        //console.log('createConfig response: ', response);
        if (response.affectedRows === 1) {
          setCompleted(`${completed}\n Created config record\n`);
        } else {
          flagWarning(
            'Insert config record',
            'The config record could not be inserted.'
          );
          return false;
        }
      })
      .catch((error) => {
        //console.log('Config error: ', error);
        flagWarning('Config error', error);
        return false;
      });
    return true;
  };

  const colours = () => {
    const background = state.fields.entities['background'].value;
    const font = state.fields.entities['font'].value;
    const header = state.fields.entities['header'].value;
    const axisOne = state.fields.entities['axisOne'].value;
    const labelOne = state.fields.entities['labelOne'].value;
    const barOne = state.fields.entities['barOne'].value;

    return (
      <Grid container stackable>
        <Grid.Row>
          <div className="colourDiv">
            <Form.Input
              error={state.fields.entities['background'].error}
              id="form-input-control-client-background"
              name="background"
              label="background"
              onChange={handleChange}
              type="text"
              value={state.fields.entities['background'].value}
            />
            <div
              className="colourBox"
              style={{
                backgroundColor: background,
              }}
            ></div>
          </div>

          <div className="colourDiv">
            <Form.Input
              error={state.fields.entities['font'].error}
              id="form-input-control-client-font"
              name="font"
              label="font"
              onChange={handleChange}
              type="text"
              value={state.fields.entities['font'].value}
            />
            <div
              className="colourBox"
              style={{
                backgroundColor: font,
              }}
            ></div>
          </div>

          <div className="colourDiv">
            <Form.Input
              error={state.fields.entities['header'].error}
              id="form-input-control-client-header"
              name="header"
              label="header"
              onChange={handleChange}
              type="text"
              value={state.fields.entities['header'].value}
            />
            <div
              className="colourBox"
              style={{
                backgroundColor: header,
              }}
            ></div>
          </div>
        </Grid.Row>

        <Grid.Row>
          <div className="colourDiv">
            <Form.Input
              error={state.fields.entities['axisOne'].error}
              id="form-input-control-client-axisOne"
              name="axisOne"
              label="axisOne"
              onChange={handleChange}
              type="text"
              value={state.fields.entities['axisOne'].value}
            />
            <div
              className="colourBox"
              style={{
                backgroundColor: axisOne,
              }}
            ></div>
          </div>

          <div className="colourDiv">
            <Form.Input
              error={state.fields.entities['labelOne'].error}
              id="form-input-control-client-labelOne"
              name="labelOne"
              label="labelOne"
              onChange={handleChange}
              type="text"
              value={state.fields.entities['labelOne'].value}
            />
            <div
              className="colourBox"
              style={{
                backgroundColor: labelOne,
              }}
            ></div>
          </div>

          <div className="colourDiv">
            <Form.Input
              error={state.fields.entities['barOne'].error}
              id="form-input-control-client-barOne"
              name="barOne"
              label="barOne"
              onChange={handleChange}
              type="text"
              value={state.fields.entities['barOne'].value}
            />
            <div
              className="colourBox"
              style={{
                backgroundColor: barOne,
              }}
            ></div>
          </div>
        </Grid.Row>
      </Grid>
      /*<>
        <p>
          <Form.Input
            error={state.fields.entities['background'].error}
            id="form-input-control-client-background"
            name="background"
            label="background"
            onChange={handleChange}
            type="text"
            value={state.fields.entities['background'].value}
          />
          <div
            style={{
              backgroundColor: background,
              height: '25px',
              width: '190px',
            }}
          ></div>

          <Form.Input
            error={state.fields.entities['font'].error}
            id="form-input-control-client-font"
            name="font"
            label="font"
            onChange={handleChange}
            type="text"
            value={state.fields.entities['font'].value}
          />
          <div
            style={{
              backgroundColor: font,
              height: '25px',
              width: '190px',
            }}
          ></div>

          <Form.Input
            error={state.fields.entities['header'].error}
            id="form-input-control-client-header"
            name="header"
            label="header"
            onChange={handleChange}
            type="text"
            value={state.fields.entities['header'].value}
          />
          <div
            style={{
              backgroundColor: header,
              height: '25px',
              width: '190px',
            }}
          ></div>
        </p>

        <p>
          <Form.Input
            error={state.fields.entities['axisOne'].error}
            id="form-input-control-client-axisOne"
            name="axisOne"
            label="axisOne"
            onChange={handleChange}
            type="text"
            value={state.fields.entities['axisOne'].value}
          />
          <div
            style={{
              backgroundColor: axisOne,
              height: '25px',
              width: '190px',
            }}
          ></div>

          <Form.Input
            error={state.fields.entities['labelOne'].error}
            id="form-input-control-client-labelOne"
            name="labelOne"
            label="labelOne"
            onChange={handleChange}
            type="text"
            value={state.fields.entities['labelOne'].value}
          />
          <div
            style={{
              backgroundColor: labelOne,
              height: '25px',
              width: '190px',
            }}
          ></div>

          <Form.Input
            error={state.fields.entities['barOne'].error}
            id="form-input-control-client-barOne"
            name="barOne"
            label="barOne"
            onChange={handleChange}
            type="text"
            value={state.fields.entities['barOne'].value}
          />
          <div
            style={{
              backgroundColor: barOne,
              height: '25px',
              width: '190px',
            }}
          ></div>
        </p>
      </>*/
    );
  };

  return (
    <Container>
      <Modal dimmer="blurring" open={uploading}>
        <Modal.Header>Creating a new client...</Modal.Header>
        <Modal.Content>{completed}</Modal.Content>
      </Modal>

      <Modal dimmer="blurring" open={warning}>
        <Modal.Header>We ran into a problem</Modal.Header>
        <Modal.Content>{warningMessage}</Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => setWarning(false)}>
            <Icon name="warning" />
            Okay
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal dimmer="blurring" open={success}>
        <Modal.Header>Success!</Modal.Header>
        <Modal.Content>{client.name} was created</Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={() => setSuccess(false)} positive>
            Okay
          </Button>
        </Modal.Actions>
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

        <Grid columns={2} stackable>
          <Grid.Row>
            <Grid.Column>
              <Form.Input
                error={state.fields.entities['logo'].error}
                id="form-input-control-client-logo"
                name="logo"
                label="Logo"
                onChange={handleLogoChange}
                type="file"
                value={state.fields.entities['logo'].value}
              />
              <Image
                className="demo logo"
                alt="client logo"
                disabled
                size="medium"
                src={state.fields.entities['logo'].location}
              />
            </Grid.Column>
            <Grid.Column>{colours()}</Grid.Column>
          </Grid.Row>
        </Grid>

        {/*<Grid.Row>
            <Grid.Column width={6}>
              <Form.Input
                error={state.fields.entities['logo'].error}
                id="form-input-control-client-logo"
                name="logo"
                label="Logo"
                onChange={handleLogoChange}
                type="file"
                value={state.fields.entities['logo'].value}
              />
              <Image
                className="demo logo"
                alt="client logo"
                disabled
                size="medium"
                src={state.fields.entities['logo'].location}
              />
            </Grid.Column>
            <Grid.Column width={10}>{colours()}</Grid.Column>
          </Grid.Row>
        </Grid>*/}

        <Button.Group size="large">
          <Button content="Submit" onClick={handleSubmit} />
          <Button.Or />
          <Button content="Cancel" onClick={handleCancel} />
        </Button.Group>
      </Form>
    </Container>
  );
};

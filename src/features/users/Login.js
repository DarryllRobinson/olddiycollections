import React, { useState } from 'react';
import { Button, Form, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const LoginForm = () => {
  // Email methods
  const [email, setEmail] = useState('');
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  // Password methods
  const [password, setPassword] = useState('');
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // Form methods
  const handleSubmit = (e) => {
    e.preventDefault();
    const loginDatetime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    const user = {
      email: email,
      password: password,
      loginDate: loginDatetime,
    };
  };

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          <Icon name="user" />
          Log-in to your account
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              onBlur={(e) => handleEmail(e)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onBlur={(e) => handlePassword(e)}
            />

            <Button color="teal" fluid size="large">
              Login
            </Button>
          </Segment>
        </Form>

        <Segment stacked>
          New to us?
          <br />
          <br />
          <Button as={Link} to="/signup" color="teal" fluid size="large">
            Sign Up
          </Button>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, Grid, Header, Icon, Segment } from 'semantic-ui-react';

//import { loginUser } from './usersSlice';
import { accountService } from '../../services/account.service';

const LoginForm = () => {
  const dispatch = useDispatch();

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

    /*const user = {
      email: email,
      password: password,
    };

    dispatch(loginUser(user));*/
    accountService.login(email, password);
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
              type="email"
              onChange={(e) => handleEmail(e)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={(e) => handlePassword(e)}
            />

            <Button color="teal" fluid size="large">
              Login
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;

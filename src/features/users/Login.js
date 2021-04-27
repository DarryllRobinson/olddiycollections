import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { loginUser } from './usersSlice';

const LoginForm = () => {
  const dispatch = useDispatch();

  const userStatus = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

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

    const user = {
      email: email,
      password: password,
    };

    dispatch(loginUser(user));

    let content;

    if (userStatus === 'loading') {
      content = <div>Loading...</div>;
    } else if (userStatus === 'succeeded') {
      console.log('yay');
    } else if (userStatus === 'error') {
      content = <div>{error}</div>;
      console.log(content.props.children);
    }
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

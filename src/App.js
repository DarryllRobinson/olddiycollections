import React from 'react';
import { Redirect, Router, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import history from './history';
import Home from './Home';

// User
import Login from './features/users/Login';
import SignUp from './features/users/SignUp';
import { UsersList } from './features/users/UsersList';
import { UserPage } from './features/users/UserPage';

const App = () => {
  return (
    <Container fluid>
      <Router history={history}>
        <>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={SignUp} />
            <Route path="/users" exact component={UsersList} />
            <Route path="/users/:userId" exact component={UserPage} />

            <Redirect to="/" />
          </Switch>
        </>
      </Router>
    </Container>
  );
};

export default App;

import React from 'react';
import { Redirect, Router, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { PrivateRoute } from './services/PrivateRoute';
import { AgentWorkspace } from './services/AgentWorkspace';

import history from './history';
import Home from './Home';

// User
import Login from './features/users/Login';
import SignUp from './features/users/SignUp';

const App = () => {
  return (
    <Container fluid>
      <Router history={history}>
        <div>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={SignUp} />

            {/* Agent workspace routes */}
            <PrivateRoute component={AgentWorkspace} />

            <Redirect to="/" />
          </Switch>
        </div>
      </Router>
    </Container>
  );
};

export default App;

import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Security from './Security';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const [safe, setSafe] = React.useState(true);
  const [timer, setTimer] = React.useState(100); // setting to 100 so it doesn't show on the Dashboard
  const [role, setRole] = React.useState('');
  const [user, setUser] = React.useState('');

  React.useEffect(() => {
    //console.log('refreshTime: ', refreshTime);
    //const interval = setInterval(() => {
    const security = new Security();
    // Checking it is still safe
    const { role, safe, user } = security.validateSession('PrivateRoute');
    setSafe(safe);
    setRole(role);
    setUser(user);
    setTimer(security.refreshTime());
    //}, 600000);
    //return () => clearInterval(interval);
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => {
        PrivateRoute.propTypes = {
          component: PropTypes.any,
        };

        if (!safe) {
          //console.log('not safe');
          //security.terminateSession();
          return <Redirect to={{ pathname: '/' }} />;
        }

        return <Component role={role} timer={timer} user={user} {...props} />;
      }}
    />
  );
};

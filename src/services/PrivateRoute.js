import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Security from './Security';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  //const { path } = rest;
  const [safe, setSafe] = React.useState(true);
  const [timer, setTimer] = React.useState(100); // setting to 100 so it doesn't show on the Dashboard
  const [role, setRole] = React.useState('');
  const [user, setUser] = React.useState('');
  //console.log('rest: ', rest);
  //console.log('role from ComponentRoutes: ', role);

  const startTimer = React.useCallback(() => {
    // don't want timer running if user is logged out
    if (sessionStorage.getItem('refreshToken')) {
      const interval = setInterval(() => {
        const security = new Security();
        security.validateSession('PrivateRoute');
      }, 600000);
      return () => clearInterval(interval);
    }
  }, []);

  React.useEffect(() => {
    //  const interval = setInterval(() => {
    const security = new Security();
    // Checking it is still safe
    const { role, safe, user } = security.validateSession('PrivateRoute');
    //const vsec = security.validateSession('PrivateRoute');
    //console.log('PrivateRoute vsec: ', vsec);
    setSafe(safe);
    setRole(role);
    setUser(user);
    setTimer(security.refreshTime());
    startTimer();
    //    }, 600000);
    //    return () => clearInterval(interval);
  }, [role, safe, startTimer, user]);

  return (
    <Route
      {...rest}
      render={(props) => {
        PrivateRoute.propTypes = {
          component: PropTypes.any,
          role: PropTypes.string,
        };

        if (!safe) {
          //console.log('not safe');
          //security.terminateSession();
          return (
            <Redirect to={{ pathname: '/', state: { from: props.location } }} />
          );
        }

        return <Component role={role} timer={timer} user={user} {...props} />;
      }}
    />
  );
};

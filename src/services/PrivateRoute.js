import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Security from './Security';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const [safe, setSafe] = React.useState(true);

  React.useEffect(() => {
    //console.log('refreshTime: ', refreshTime);
    const interval = setInterval(() => {
      const security = new Security();
      // Checking it is still safe
      setSafe(security.validateSession('PrivateRoute'));
    }, 10000);
    return () => clearInterval(interval);
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

        return <Component {...props} />;
      }}
    />
  );
};

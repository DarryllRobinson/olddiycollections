import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Security from '../services/Security';

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      PrivateRoute.propTypes = {
        component: PropTypes.any,
      };

      const security = new Security();
      const safe = security.validateSession();

      if (!safe) {
        //security.terminateSession();
        return <Redirect to={{ pathname: '/' }} />;
      }

      return <Component {...props} />;
    }}
  />
);

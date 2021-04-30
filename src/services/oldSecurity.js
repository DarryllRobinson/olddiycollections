import React from 'react';
import { useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';

import { refreshToken } from '../features/users/usersSlice';

const Security = () => {
  const dispatch = useDispatch();

  const WriteLoginSession = (refreshToken) => {
    sessionStorage.setItem('refreshToken', refreshToken);
  };

  const ValidateSession = (component) => {
    console.log(component + ' is calling validateSession');
    let refreshToken = sessionStorage.getItem('refreshToken');

    if (refreshToken && refreshToken !== undefined) {
      let decodedToken = jwtDecode(refreshToken);

      if (decodedToken.exp < new Date().getTime() / 1000) {
        console.log('refreshToken expired');
        TerminateSession();
        return false;
      } else if (
        decodedToken.exp - 892 <
        Math.floor(new Date().getTime() / 1000)
      ) {
        console.log('Need to extend session');
        ExtendSession();
      } else {
        console.log(
          'refreshToken still valid: ',
          decodedToken.exp - new Date().getTime() / 1000
        );
      }

      return true;
    } else {
      // There is no token so session is automatically invalid
      TerminateSession();
      return false;
    }
  };

  const ExtendSession = () => {
    const dispatch = useDispatch();
    let token = sessionStorage.getItem('refreshToken');
    let decodedToken = jwtDecode(token);

    const user = {
      id: decodedToken.id,
      email: decodedToken.email,
      firstName: decodedToken.firstName,
      surname: decodedToken.surname,
      role: decodedToken.role,
      refreshToken: token,
    };
    console.log('extendSession: ', user);

    dispatch(refreshToken(user));
    //return <div></div>;
  };

  const TerminateSession = () => {
    sessionStorage.removeItem('refreshToken');
  };
};

export default Security;

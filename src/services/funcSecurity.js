import React from 'react';
import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux';
//import moment from 'moment';

import { refreshToken } from '../features/users/usersSlice';
import { Test } from './Test';

export const WriteLoginSession = (refreshToken) => {
  sessionStorage.setItem('refreshToken', refreshToken);
};

export const ValidateSession = (component) => {
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
  Test();
  //const dispatch = useDispatch();
  /*let token = sessionStorage.getItem('refreshToken');
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

  dispatch(refreshToken(user));*/
  //return <div></div>;
};

export const TerminateSession = () => {
  sessionStorage.removeItem('refreshToken');
};

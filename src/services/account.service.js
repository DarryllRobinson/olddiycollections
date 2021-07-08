/*import { BehaviorSubject } from 'rxjs';

import MysqlLayer from './MysqlLayer';
const mysqlLayer = new MysqlLayer();

const userSubject = new BehaviorSubject(null);

export const accountService = {
  login,
};

function login(email, password) {
  mysqlLayer.Post('/users/login', { email, password }).then((user) => {
    console.log(user);
    // publish user to subscribers and start timer to refresh token
    userSubject.next(user);
    startRefreshTokenTimer();
    return user;
  });
}

function refreshToken() {}

let refreshTokenTimeout;

function startRefreshTokenTimer() {
  // parse json from base64 encoded jwt
  const jwtToken = JSON.parse(atob(userSubject.value.jwtToken.split('.')[1]));

  // set a timeout to refresh the token a minute before it expires
  const expires = new Date(jwtToken.exp * 1000);
  const timeout = expires.getTime() - Date.now() - 60 * 1000;
  refreshTokenTimeout = setTimeout(refreshToken, timeout);
}
*/

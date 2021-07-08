import jwtDecode from 'jwt-decode';
import MysqlLayer from './MysqlLayer';
//import { client } from '../api/client';
//import moment from 'moment';

import history from '../history';

export default class Security {
  mysqlLayer = new MysqlLayer();

  writeLoginSession(refreshToken) {
    //sessionStorage.setItem('token', response.token);
    sessionStorage.setItem('refreshToken', refreshToken);
  }

  validateSession(component) {
    console.log(component + ' is calling validateSession');
    let refreshToken = sessionStorage.getItem('refreshToken');
    //console.log('refreshToken for validateSession: ', refreshToken);

    if (refreshToken) {
      let decodedToken = jwtDecode(refreshToken);

      if (decodedToken.exp < new Date().getTime() / 1000) {
        console.log('refreshToken expired');
        this.terminateSession();
        return false;
      } else if (
        decodedToken.exp - 3000 <
        Math.floor(new Date().getTime() / 1000)
      ) {
        /*console.log(
          'Need to extend session: ',
          decodedToken.exp,
          Math.floor(new Date().getTime() / 1000)
        );*/
        this.extendSession();
      } /*else {
        console.log(
          'refreshToken still valid: ',
          decodedToken.exp - new Date().getTime() / 1000
        );
      }*/

      return { safe: true, role: decodedToken.role, user: decodedToken.email };
    } else {
      // There is no token so session is automatically invalid
      this.terminateSession();
      const returnObj = { safe: false, role: '', user: '' };
      return returnObj;
    }
  }

  async extendSession() {
    //const dispatch = useDispatch();
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
    //console.log('extendSession: ', user);

    const response = await this.mysqlLayer.Post('/users/refresh', user);
    //console.log('extendSession response: ', response.data.user[0].refreshToken);
    sessionStorage.setItem('refreshToken', response.user[0].refreshToken);
  }

  terminateSession() {
    sessionStorage.removeItem('refreshToken');
    this.stopTimer('terminateSession from Logout on whichever Menu component');
    history.push('/');
  }

  refreshTime() {
    let token = sessionStorage.getItem('refreshToken');
    //console.log('token for refreshTime: ', token);
    let decodedToken = token ? jwtDecode(token) : 0;
    return decodedToken.exp - 100 - Math.floor(new Date().getTime() / 1000);
  }

  getRole() {
    let decodedToken = jwtDecode(sessionStorage.getItem('refreshToken'));
    return decodedToken.role;
  }

  startTimer(component) {
    console.log('startTimer called by ', component);
  }

  resetTimer(component) {
    console.log('resetTimer called by ', component);
  }

  stopTimer(component) {
    console.log('stopTimer called by ', component);
  }
}

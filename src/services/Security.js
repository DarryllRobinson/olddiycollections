import jwtDecode from 'jwt-decode';
import { client } from '../api/client';
//import moment from 'moment';

export default class Security {
  writeLoginSession(refreshToken) {
    //sessionStorage.setItem('token', response.token);
    sessionStorage.setItem('refreshToken', refreshToken);
  }

  validateSession(component) {
    console.log(component + ' is calling validateSession');
    let refreshToken = sessionStorage.getItem('refreshToken');

    if (refreshToken && refreshToken !== undefined) {
      let decodedToken = jwtDecode(refreshToken);

      if (decodedToken.exp < new Date().getTime() / 1000) {
        console.log('refreshToken expired');
        this.terminateSession();
        return false;
      } else if (
        decodedToken.exp - 100 <
        Math.floor(new Date().getTime() / 1000)
      ) {
        console.log('Need to extend session');
        this.extendSession();
      } else {
        console.log(
          'refreshToken still valid: ',
          decodedToken.exp - new Date().getTime() / 1000
        );
      }

      return true;
    } else {
      // There is no token so session is automatically invalid
      this.terminateSession();
      return false;
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

    const response = await client.post('/users/refresh', user);
    //console.log('extendSession response: ', response.user[0].refreshToken);
    sessionStorage.setItem('refreshToken', response.user[0].refreshToken);
  }

  terminateSession() {
    sessionStorage.removeItem('refreshToken');
  }
}

import jwtDecode from 'jwt-decode';

export default class Authentication {
  retrieveUser() {
    let token = sessionStorage.getItem('refreshToken');
    if (token) {
      let decodedToken = jwtDecode(token);
      return decodedToken.email;
    }
  }
}

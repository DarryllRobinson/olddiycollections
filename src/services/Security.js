import jwtDecode from 'jwt-decode';

export default class Security {
  writeLoginSession(user) {
    sessionStorage.setItem('unikey', user.token);
  }

  validateSession() {
    let token = sessionStorage.getItem('unikey');
    const d = new Date();

    if (token && token !== undefined) {
      let decodedToken = jwtDecode(token);
      console.log(token);
      console.log(decodedToken);

      if (d > decodedToken.expiry) {
        this.terminateSession();
        return false;
      }
      return true;
    } else {
      // There is no token so session is automatically invalid
      this.terminateSession();
      return false;
    }
  }

  extendSession() {
    sessionStorage.setItem('session', new Date().toString());
  }

  terminateSession() {
    sessionStorage.removeItem('unikey');
  }
}

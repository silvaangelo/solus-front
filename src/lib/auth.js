class Auth {
  static token_field = 'token'
  
  static setToken(token) {
    localStorage.setItem(Auth.token_field, token)
  }

  static getToken() {
    return localStorage.getItem(Auth.token_field);
  }

  static logout() {
    localStorage.clear();
  }

  static isAuthenticated() {
    return localStorage.getItem(Auth.token_field) !== null;
  }
}

export { Auth };
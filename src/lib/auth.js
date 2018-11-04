class Auth {
  static token_field = 'token';
  static id_field = 'id';
  
  static setUserData(token, id) {
    localStorage.setItem(Auth.token_field, token);
    localStorage.setItem(Auth.id_field, id);
  }

  static getToken() {
    return localStorage.getItem(Auth.token_field);
  }

  static getId() {
    return localStorage.getItem(Auth.id_field);
  }

  static logout() {
    localStorage.clear();
  }

  static isAuthenticated() {
    return localStorage.getItem(Auth.token_field) !== null;
  }
}

export { Auth };
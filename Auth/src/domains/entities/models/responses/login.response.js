class LoginResponse {
  constructor(userId, username, email, gender, access_token) {
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.gender = gender;
    this.access_token = access_token;
  }
}

export default LoginResponse;

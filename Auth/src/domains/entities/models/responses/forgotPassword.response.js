class ForgotPasswordResponse {
  constructor(accountId, email, verification_code, account_status) {
    this.accountId = accountId;
    this.email = email;
    this.verification_code = verification_code;
    this.account_status = account_status;
  }
}

export default ForgotPasswordResponse;

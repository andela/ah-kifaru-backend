export default {
  successSignupMessage:
    'User is signed up, an email is sent to your mail account, please verify your mail account to complete registration',
  msgForPasswordReset(username, url, token) {
    return `
    <div>
        <h3>Hi ${username},</h3>
        <p>You requested for a Password reset on your account. You can use the following link to reset your password:
        <br />
            <br /> <br />
            <a href="${url}/auth/reset-password/${token}">${url}/auth/reset-password/${token}</a>
        </p>
        <p>If you don’t use this link within 10 minutes, it will expire. To get a new password reset link, visit <a href="${url}/auth/reset-password/">${url}/auth/reset-password/</a></p>
  </div>`;
  }
};

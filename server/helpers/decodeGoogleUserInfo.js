const {OAuth2Client} = require('google-auth-library');
require('dotenv').config();

module.exports = (token) => {
  const client = new OAuth2Client(token);
  return client
    .verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_TOKEN
    })
    .then(ticket => {
      const payload = ticket.getPayload();
      return payload;
    })
    .catch(err => {
      return err;
    })
}
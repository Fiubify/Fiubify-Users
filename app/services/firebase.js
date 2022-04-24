const admin = require('firebase-admin');
const serviceAccount = require('../config/fiubify-firebase-adminsdk-5fktf-c29a583ecf.json');
//TODO pasar a secret
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = {
  auth: admin.auth(),
};

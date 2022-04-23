const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to mongo'))
  .catch((e) => console.log(e));

const admin = require('firebase-admin');
const serviceAccount = require('./config/fiubify-firebase-adminsdk-5fktf-c29a583ecf.json');
//TODO pasar a secret
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = require('./app');

const PORT = 3000;

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

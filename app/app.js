const express = require('express');

const admin = require('firebase-admin');
const serviceAccount = require('./config/fiubify-firebase-adminsdk-5fktf-c29a583ecf.json');
//TODO pasar a secret
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Routes import
const authRouter = require('./routes/auth_routes');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded());

// Routes
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Initial Setup');
});

module.exports = app;

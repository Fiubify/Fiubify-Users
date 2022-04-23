const express = require('express');

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

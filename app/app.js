const express = require('express');

// Initialize global services
require('./services/firebase');
require('./services/db');

// Routes import
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');

// Middlewares import
const errorHandlerMiddleware = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded());

// Routes
app.use('/user', userRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Initial Setup');
});

// Error handling middlewares
app.use(errorHandlerMiddleware);

module.exports = app;

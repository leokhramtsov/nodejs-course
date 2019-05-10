const express = require('express');
require('./db/mongoose');
const userRoute = require('./routers/user');
const taskRoute = require('./routers/task');

const app = express();

app.use(express.json());
app.use('/users', userRoute);
app.use('/tasks', taskRoute);

module.exports = app;

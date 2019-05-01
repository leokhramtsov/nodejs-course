const express = require('express');
require('./db/mongoose');

const app = express();
const port = process.env.port || 3000;

const userRoute = require('./routers/user');
const taskRoute = require('./routers/task');

app.use(express.json());

app.use('/users', userRoute);
app.use('/tasks', taskRoute);

app.listen(port, () => console.log(`Server is up on port ${port}`));

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

// const bcrypt = require('bcryptjs');
// const myFunction = async () => {
//   const password = 'Heyy123';
//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(password, salt);
//   const isMatch = await bcrypt.compare('lalaland', hash);
//   console.log(hash);
//   console.log(isMatch);
// };

// myFunction();

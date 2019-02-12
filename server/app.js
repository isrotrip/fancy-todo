const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const verifyUser = require('./middlewares/verifyUser.js');

//routes
const userRoute = require('./routes/userRoute.js');
const todoRoute = require('./routes/todoRoute.js');

const app = express();
const port = 3000;
const databaseName = 'fancy_todo_isro';
const urlDatabase = `mongodb://localhost:27017/${databaseName}`;

mongoose.connect(urlDatabase, {useNewUrlParser: true});

app.use(cors());
app.use(express.urlencoded({extended: false}));

//routing
app.use('/user', userRoute);
app.use(verifyUser.authentication);
app.use('/todo', todoRoute);

app.listen(port, () => {
  console.log(`connected on the port ${port}`)
})
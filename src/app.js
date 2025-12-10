const express = require('express');
const tasksRouter = require('./routes/tasks');

const app = express();
app.use(express.json());


app.use('/tasks', tasksRouter);


app.get('/', (req, res) => res.json({ status: 'ok' }));

module.exports = app;

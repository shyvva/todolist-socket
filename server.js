const express = require('express');
const socket = require('socket.io');

const tasks = [];

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', socket => {
  console.log('New client! Its id - ' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', newTask => {
    tasks.push(newTask);
    socket.broadcast.emit('addTask', newTask);
    console.log(tasks);
  });

  socket.on('removeTask', data => {
    console.log(`remove task of id=${data}`);
    const getTask = tasks.find(task => task.id == data);
    const taskIndex = tasks.indexOf(getTask);
    tasks.splice(taskIndex, 1);
    socket.broadcast.emit('removeTask', data);
    console.log(tasks);
  });
});

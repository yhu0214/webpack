'use strict';

const path = require('path');
const express = require('express');
const io = require('socket.io')();

// default port where dev server listens for incoming traffic
const port = process.env.PORT || 8000;
const app = express();

app.use(express.static(path.resolve(__dirname, '../dist')));

module.exports = app.listen(port, error => {
  if (error) {
    console.log(error);
    return;
  }

  console.log(`Listening at http://localhost:${port}\n`);
});

// setup the socket
io.on('connection', socket => {
  socket.on('message', function (message) {
    // this is the catch all, just proxity it to the other connections
    socket.broadcast.send(message);
  });
})
io.listen(module.exports);

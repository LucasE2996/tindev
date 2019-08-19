const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query;

    connectedUsers[user] = socket.id;
});

const port = 3001;

// connect to database using mongoose (RDB labrary)
mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-8vzz7.mongodb.net/omnistack?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;
    console.log('\x1b[33m%s\x1b[0m', `Connected users:`);
    console.log(connectedUsers);

    return next();
});

app.use(cors()); // enable cors
app.use(express.json()); // tell express that the routes will send data in JSON format
app.use(routes); // apply routes to server

// start server on port 3000
console.log(`Listening port: ${port}`);
server.listen(port);
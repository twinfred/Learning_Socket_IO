var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var connections = [];
var color = "red";

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
    res.render('index');
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    io.emit('color', {color: color});
    // DISCONNECT
    socket.on('disconnect', function(data){
        connections.splice(connections.indexOf(socket), 1);
    });
    // BTN CLICK
    socket.on('clicked', function(data){
        color = data.color;
        io.emit('color', {color: color});
    });
});

server.listen(2880, function(){
    console.log("Server running on port 2880.");
});
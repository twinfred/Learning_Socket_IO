var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var connections = [];
var users = [];

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname+"/static"));

app.get('/', function(req, res){
    res.render('index');
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log(connections)
    // DISCONNECT
    socket.on('disconnect', function(data){
        connections.splice(connections.indexOf(socket), 1)
    })
    // SUBMIT FORM
    socket.on('form submit', function(data){
        data.rand_num = Math.floor(Math.random() * 1001);
        socket.emit('form info', data);
    })
});

server.listen(3000, function(){
    console.log("Server running on port 3000!");
});
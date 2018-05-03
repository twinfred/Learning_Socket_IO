var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var connections = [];
var epicCount = 0;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
    res.render('index');
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    io.emit('Epic Button Count', {count: epicCount});
    // DISCONNECT
    socket.on('disconnect', function(data){
        connections.splice(connections.indexOf(socket), 1);
    });
    // BTN CLICK
    socket.on('Clicked', function(){
        epicCount += 1;
        io.emit('Epic Button Count', {count: epicCount});
    })
    socket.on('Reset', function(){
        epicCount = 0;
        io.emit('Epic Button Count', {count: epicCount});
    })
})

server.listen(2888, function(){
    console.log("Server running on port 2888.");
});
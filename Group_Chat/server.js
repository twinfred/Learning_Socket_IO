var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var connections = [];
var users = [];
var messages = [];

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
    res.render('index');
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    var time = new Date();
    showMessage();
    // DISCONNECT
    socket.on('disconnect', function(data){
        if(!socket.username){
            return;
        }else{
            users.splice(users.indexOf(socket.username), 1);
            updateUsernames();
        }

        connections.splice(connections.indexOf(socket), 1);
    });
    // NEW USER LOGIN
    socket.on('new user', function(data, callback){
        callback();
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    })
    // UPDATE USER LIST
    function updateUsernames(){
        io.sockets.emit('user added', users);
    }
    // ADD USER MESSAGE
    socket.on('chat message', function(data){
        data.time = (
            time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        );
        console.log(data);
        messages.push(data);
        showMessage();
    })
    // SHOW MESSAGES
    function showMessage(){
        io.sockets.emit('messages display', messages);
    }
});

server.listen(3220, function(){
    console.log("Server running on port 3220.");
});
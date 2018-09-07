var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html'); //read the html file
});

http.listen(8080, function(){
    console.log('listening on *:8080');
});

io.on('connection', function(socket){ //on connection event

    var userConnected = null;
    var alreadyConnect = false;

    socket.on('userConnection',function(user){
        userConnected = user;

        users.push(userConnected);
        socket.broadcast.emit('chat msg', userConnected + " is connected");

        if(alreadyConnect == false){
            for(var i = 0; i< users.length; i++){
                io.emit('addUser', users[i]);
            }
            alreadyConnect = true;
        }
        else{
            socket.broadcast.emit('addUser', user);
        }

    })

    .on('disconnect',function(){
        if(userConnected !== undefined){
            socket.broadcast.emit('chat msg', userConnected + " is disconnected");
        }
    })

    .on('chat msg', function(msg){ //on chat message event 
        if(msg != "" ){ //verify the message is not empty
            io.emit('chat msg',userConnected + ": " + msg); //finally broadcast the message
        } 
    });
});
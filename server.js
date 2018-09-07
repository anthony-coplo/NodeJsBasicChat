var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html'); //read the html file
});

http.listen(8080, function(){
    console.log('listening on *:8080');
});

io.on('connection', function(socket){ //on connection event
    socket.broadcast.emit('newUser',"a new user is connected");
    socket.on('disconnect',function(){
        socket.broadcast.emit('disconnectUser',"a user is disconnected");
    })
    socket.on('chat msg', function(msg){ //on chat message event 
        if(msg != "" ){ //verify the message is not empty
            io.emit('chat msg',msg); //finally broadcast the message
        } 
    });
});
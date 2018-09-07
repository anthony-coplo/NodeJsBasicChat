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

    var userConnected = null;

    socket.on('userConnection',function(user){
        userConnected = user;
        socket.broadcast.emit('chat msg', userConnected + " is connected");
    })

    .on('disconnect',function(){
        socket.broadcast.emit('chat msg',"a user is disconnected");
    })

    .on('chat msg', function(msg){ //on chat message event 
        if(msg != "" ){ //verify the message is not empty
            io.emit('chat msg',userConnected + " said: " + msg); //finally broadcast the message
        } 
    });
});
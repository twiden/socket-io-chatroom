var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname });
});

io.on('connection', function(socket){
  var name;
  socket.on('new user', function(nickname){
    name = nickname;
    io.emit('user connect', 'Welcome ' + name)
  });

  socket.on('disconnect', function(){
    io.emit('user disconnect', 'Bye ' + name);
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

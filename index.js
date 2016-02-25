var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var typers = {};

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname });
});

io.on('connection', function(socket){
  var name;
  socket.emit('users typing', Object.keys(typers));
  socket.on('new user', function(nickname){
    name = nickname;
    io.emit('user connect', 'Welcome ' + name)
  });

  socket.on('typing', function(is_typing){
  	if (is_typing) {
  		typers[name] = true;
  	}
  	else {
  		delete typers[name];
  	}
    io.emit('users typing', Object.keys(typers));
  });

  socket.on('disconnect', function(){
    io.emit('user disconnect', 'Bye ' + name);
    delete typers[name];
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', {sender: name, msg: msg});
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

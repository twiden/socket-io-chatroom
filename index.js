var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = {'everyone': true};
var typers = {};

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname });
});

io.on('connection', function(socket){
  var name;
  socket.emit('users typing', Object.keys(typers));
  socket.on('new user', function(nickname){
    name = nickname;
    users[name] = socket;
    io.emit('user connect', 'Welcome ' + name)
    io.emit('list users', Object.keys(users))
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
    delete users[name];
    io.emit('list users', Object.keys(users))
  });

  socket.on('chat message', function(msg){
  	var to = msg.to;
  	var message = msg.msg;
  	if (to == 'everyone') {
  		io.emit('chat message', {sender: name, msg: message, to: to, private: false});
  	}
  	else {
  		var send_this = {sender: name, msg: message, to: to, private: true};
  		users[to].emit('chat message', send_this);
  		if (to != name){
  			socket.emit('chat message', send_this);
  		}
  	}
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

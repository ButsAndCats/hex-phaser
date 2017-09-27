var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

// Serving static files
app.use('/src',express.static(__dirname + '/src'));
app.use('/lib',express.static(__dirname + '/lib'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});

// Keep track of the last id assigned to a new player
server.lastPlayderID = 0;

// Listens to port 8081
server.listen(8081,function(){
  console.log('Listening on '+server.address().port);
});

io.on('connection',function(socket){
  socket.on('newplayer',function(){
    socket.player = {
      id: server.lastPlayderID++,
      x: randomInt(100,400),
      y: randomInt(100,400)
    };
    socket.emit('allplayers',getAllPlayers());
    socket.broadcast.emit('newplayer',socket.player);
  });
});

function getAllPlayers(){
  var players = [];
  Object.keys(io.sockets.connected).forEach(function(socketID){
    var player = io.sockets.connected[socketID].player;
    if(player) players.push(player);
  });
  return players;
}

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

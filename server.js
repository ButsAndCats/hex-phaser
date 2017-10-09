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
server.listen(8081, function() {
  console.log('Listening on '+server.address().port);
});

io.on('connection', function(socket) {
  socket.on('playerConnectedToLobby', function() {
    socket.player = {
      id: server.lastPlayderID++,
      name: 'George'
    };

    // Return all of the other players in the lobby to the client that just connected
    socket.emit('lobbyAllPlayers', getAllPlayers());

    // send a message to all players excluding the triggerer
    socket.broadcast.emit('playerConnectedToLobby', socket.player);
    // log the player to the terminal
    console.log(socket.player.name+' connected to the lobby');

    // Listen for players sending messages to the lobby
    socket.on('playerSentLobbyMessage', function(message) {
      // Send the message to all the connected sockets
      socket.broadcast.emit('playerSentLobbyMessage', socket.player);
      // Log the message and player to the terminal
      console.log(socket.player.name)
      console.log(message)

    });
  });
});

// Loop through the sockets and return all the connected players
function getAllPlayers(){
  var players = [];
  Object.keys(io.sockets.connected).forEach(function(socketID){
    var player = io.sockets.connected[socketID].player;
    if(player) players.push(player);
  });
  return players;
}

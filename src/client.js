var Client = {};
Client.socket = io.connect();

// Out
Client.playerConnectedToLobby = function(){
  Client.socket.emit('playerConnectedToLobby');
};
Client.lobbyMessage = function(message) {
  console.log(message)
  Client.socket.emit('playerSentLobbyMessage', message)
}

// In
Client.socket.on('playerConnectedToLobby', function(data) {
  Lobby.prototype.playerConnected(data);
});
Client.socket.on('lobbyAllPlayers', function(players) {
  Lobby.allPlayers(players);
});
Client.socket.on('playerSentLobbyMessage', function(player, message) {
  console.log(message);
  Lobby.prototype.createMessage(player, message)
})

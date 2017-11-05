var Client = {};
Client.socket = io.connect();

// Out
Client.playerConnected = function() {
  Client.socket.emit('playerConnected', Player);
};
Client.playerConnectedToLobby = function() {
  Client.socket.emit('playerConnectedToLobby', Player);
};
Client.lobbyMessage = function(message) {
  Client.socket.emit('playerSentLobbyMessage', Player, message);
};
Client.findMatchStart = function() {
  Client.socket.emit('findMatchStart', Player);
};
Client.findMatchCancel = function() {
  Client.socket.emit('findMatchCancel', Player);
};

// In
Client.socket.on('playerConnectedToLobby', function(data) {
  Lobby.prototype.playerConnected(data);
});
Client.socket.on('lobbyAllPlayers', function(players) {
  Lobby.allPlayers(players);
});
Client.socket.on('playerSentLobbyMessage', function(player, message) {
  Lobby.prototype.createMessage(player, message);
});
Client.findMatchStarted = function(gameId) {
  Player.gameId = gameId;
};

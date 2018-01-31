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

// Game based out sockets
Client.playerChangedDirection = function(direction) {
  Client.socket.emit('playerChangedDirection', Player, Match, direction);
}
Client.playerMovedLocation = function(coords) {
  Client.socket.emit('playerMovedLocation', Player, Match, coords);
}
Client.playerInvokedMana = function(mana) {
  Client.socket.emit('playerInvokedMana', Player, Match, mana);
}


// In
Client.socket.on('playerConnectedToLobby', function(data) {
  if (game.state.current === 'Lobby') {
    Lobby.prototype.playerConnected(data);
  }
});
Client.socket.on('lobbyAllPlayers', function(players) {
  if (game.state.current === 'Lobby') {
    Lobby.allPlayers(players);
  }
});
Client.socket.on('playerSentLobbyMessage', function(message) {
  if (game.state.current === 'Lobby') {
    Lobby.prototype.createMessage(message);
  }
});
Client.socket.on('findMatchStarted', function(gameId) {
  Player.gameId = gameId;
});
Client.socket.on('hostGameFound', function(gameId) {
  Client.socket.emit('joinHostGame', { gameId: gameId, playerId: Player.id });
});
Client.socket.on('beginMatch', function(serverPlayers) {
  ServerPlayers = serverPlayers;
  console.log(JSON.stringify(serverPlayers));
  console.log(ServerPlayers);
  game.state.start("Game");
});

// Game based in events
Client.socket.on('playerChangedDirection', function(direction) {
  gameState.opponentChangedDirection(direction);
});
Client.socket.on('playerMovedLocation', function(coords) {
  gameState.opponentMovedLocation(coords);
});
Client.socket.on('playerInvokedMana', function(mana) {
  gameState.opponentInvokedMana(mana);
});

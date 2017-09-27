var Lobby = function () {};

Lobby.prototype = {
  preload: function () {
    console.log('Connecting new player');
    Client.askNewPlayer();
  }
}

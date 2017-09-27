var Lobby = function () {};

Lobby.prototype = {
  preload: function () {
    
    Client.askNewPlayer();
  }
}

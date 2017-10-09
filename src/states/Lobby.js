/*
TODO:
 - Time stamp support,
 - post local messages
 - channels
 - hit enter to send messages
*/

var Lobby = function () {};
var messageContainer;
var messageCount = 0;

Lobby.allPlayers = function(players) {
  console.log(players)
}

// Call back for when the send button is hit
Lobby.sendMessage = function() {
  // maintain focus after send has been clicked
  this.chatTextInput.startFocus();
  //Send the message to client to handle
  Client.lobbyMessage(this.chatTextInput.value)
  // empty the chat field
  this.chatTextInput.resetText();
}

Lobby.prototype = {
  init: function () {
    // Ensure the tab is always active
    this.stage.disableVisibilityChange = true;

    // create interface images
    this.chatInput = game.make.sprite(game.world.centerX, 500, 'chat-input');
    this.chatOutput = game.make.sprite(game.world.centerX, 264, 'chat-output');
    this.chatContainer = game.make.sprite(game.world.centerX, 190 , 'chat-container');
    this.sendButton = game.make.sprite(652, 506, 'send-btn-up');

    // create input fields
    this.chatTextInput = game.make.inputField(60, 510, {
      width: 580,
      font: '17px Futura',
      height: 26,
      fill: '#54442F',
      cursorColor: '#54442F',
      fillAlpha: 0,
      borderWidth: 0,
      padding: 3
    });
    // Maintain focus after submit
    this.chatTextInput.focusOutOnEnter = false;
    //start with focus on the element
    this.chatTextInput.startFocus();

  },

  create: function() {
    // Add interface images
    game.add.existing(this.chatInput).anchor.setTo(0.5,0);
    game.add.existing(this.chatContainer).anchor.setTo(0.5,0);
    game.add.existing(this.chatOutput).anchor.setTo(0.5,0);
    game.add.existing(this.sendButton);

    // Add text input
    game.add.existing(this.chatTextInput);

    // Create message container
    var params = {
      horizontalScroll: false,
      horizontalWheel: false,
      verticalScroll: true,
      verticalWheel: true,
    }
    var textStyle = {
      font: '17px Futura',
      fill: '#54442F'
    };
    messageContainer = game.add.existing(new ScrollableArea(70, 270, 680, 210, params));
    console.log(this)
    messageContainer.start();

    // Event listener for the send button
    this.sendButton.inputEnabled = true;
    this.sendButton.events.onInputDown.add(Lobby.sendMessage, this);

    // Call this at the end so that everything else has loaded
    Client.playerConnectedToLobby();
    console.log(this)
  },

  postMessage: function(message) {
    var textStyle = {
      font: '17px Futura',
      fill: '#54442F'
    };
    var messageObject = game.make.text(0, (messageCount * 30), message, textStyle);
    messageContainer.addChild(messageObject);
    messageCount++;
  },

  createMessage: function(player, message) {
    var text = player.name+': '+message;
    this.postMessage(text)
  },

  playerConnected: function(player) {
    var text = player.name+' connected';
    this.postMessage(text)
  }

}

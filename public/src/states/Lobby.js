/*
TODO:
 - Time stamp support,
 - post local messages
 - channels
 - hit enter to send messages
 - active playerlist
*/

var Lobby = function () {};
var messageContainer;
var messageCount = 0;

Lobby.allPlayers = function(players) {
  console.log(players)
}

Lobby.prototype = {
  init: function () {
    // Ensure the tab is always active so that new messages are pushed to the chat
    this.stage.disableVisibilityChange = true;

    // create interface images
    this.chatInput = game.make.sprite(game.world.centerX, 500, 'chat-input');
    this.chatOutput = game.make.sprite(game.world.centerX, 264, 'chat-output');
    this.chatContainer = game.make.sprite(game.world.centerX, 190 , 'chat-container');
    this.sendButton = game.make.sprite(652, 506, 'send-btn');
    this.playButton = game.make.sprite(game.world.centerX, 5, 'play-btn');

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
    this.chatTextInput.enterCallback = this.sendMessage;
    this.chatTextInput.enterCallbackContext = this;

    //start with focus on the element
    this.chatTextInput.startFocus();

  },

  create: function() {
    // Add interface images
    game.add.existing(this.playButton).anchor.setTo(0.5,0);
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
    messageContainer.start();

    // Event listener for the play button
    this.playButton.inputEnabled = true;
    // Toggle mouseover
    this.playButton.events.onInputDown.add(function() {
      this.playButton.frame = 1;
    }, this);
    this.playButton.events.onInputUp.add(function() {
      this.playButton.frame = 0;
      Client.findMatchStart();

      var text = 'Searching for match...'
      this.postToConsole(text);
    }, this);

    // Event listener for the send button
    this.sendButton.inputEnabled = true;
    // Toggle mouseover
    this.sendButton.events.onInputDown.add(function() {
      this.sendButton.frame = 1;
    }, this);
    this.sendButton.events.onInputUp.add(function() {
      this.sendButton.frame = 0;
    }, this);

    this.sendButton.events.onInputDown.add(this.sendMessage, this);

    var text = Player.name+': Connected to the lobby'
    this.postToConsole(text);
    // Call this at the end so that everything else has loaded
    Client.playerConnectedToLobby();
  },

  postToConsole: function(message) {
    // should create different styles for different actions
    var textStyle = {
      font: '17px Futura',
      fill: '#54442F'
    };
    // create the message
    var messageObject = game.make.text(0, (messageCount * 30), message, textStyle);
    // append the message
    messageContainer.addChild(messageObject);
    // Scroll down (x,y)
    // console.log(((messageCount) * 30))
    // console.log(messageContainer)

    messageContainer.scrollTo(70, 270, 500, false);

    // add to count
    messageCount++;
  },

  sendMessage: function() {
    if (this.chatTextInput.value != '') {
      var text = Player.name+': '+this.chatTextInput.value;
      this.postToConsole(text)

      //Send the message to client to handle
      Client.lobbyMessage(this.chatTextInput.value)
      // empty the chat field
      this.chatTextInput.resetText();
      // maintain focus after send has been clicked
      this.chatTextInput.startFocus();
    }
  },

  createMessage: function(player, message) {
    var text = player.name+': '+message;
    this.postToConsole(text)
  },

  playerConnected: function(player) {
    var text = player.name+': Connected to the lobby';
    this.postToConsole(text)
  }

}

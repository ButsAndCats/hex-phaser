/*
TODO:
 - error Handling
 - bypass login if session exists
 - add logout
*/

var Login = function () {};

Login.prototype = {
  init: function() {
    this.demoLink = game.make.text(0, 0, 'play demo', {
      font: '17px Futura',
      fill: '#54442F'
    });

    // create images
    this.logo = game.make.sprite(game.world.centerX, 190, 'logo');
    this.loginButton = game.make.sprite(game.world.centerX , (game.world.centerY+70), 'login-btn');
    this.registerButton = game.make.sprite(game.world.centerX - (350/2), (game.world.centerY+70), 'register-btn');

    // Event listener for the register button
    this.registerButton.inputEnabled = true;
    // Toggle mouseover
    this.registerButton.events.onInputDown.add(function() {
      this.registerButton.frame = 1;
    }, this);
    this.registerButton.events.onInputUp.add(function() {
      this.registerButton.frame = 0;
      this.game.state.start("Register");
    }, this);

    // Event listener for the login button
    this.loginButton.inputEnabled = true;
    // Toggle mouseover
    this.loginButton.events.onInputDown.add(function() {
      this.loginButton.frame = 1;
    }, this);
    this.loginButton.events.onInputUp.add(function() {
      this.loginButton.frame = 0;
      this.postForm(this.captureForm());
    }, this);

    // create input fields
    this.usernameTextInput = game.make.inputField(game.world.centerX - (330/2), (game.world.centerY-40), {
      width: 330,
      font: '17px Futura',
      height: 26,
      max: 25,
      placeHolder: 'Username',
      placeHolderColor: '#54442F',
      fill: '#54442F',
      cursorColor: '#54442F',
      fillAlpha: 0,
      borderWidth: 0,
      padding: 3
    });

    this.passwordTextInput = game.make.inputField(game.world.centerX-(330/2), (game.world.centerY+20), {
      width: 330,
      font: '17px Futura',
      height: 26,
      max: 25,
      placeHolder: 'Password',
      placeHolderColor: '#54442F',
      type: PhaserInput.InputType.password,
      fill: '#54442F',
      cursorColor: '#54442F',
      fillAlpha: 0,
      borderWidth: 0,
      padding: 3
    });

    // Tab between fields
    // don't block external key presses
    this.usernameTextInput.blockInput = false;
    this.passwordTextInput.blockInput = false;

    // Keep track of the currently focused input
    Login.currentFocus = -1;
    this.usernameTextInput.focusIn.add(function() {
      Login.currentFocus = 0;
    })
    this.passwordTextInput.focusIn.add(function() {
      Login.currentFocus = 1;
    })

    var tabKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TAB);
    tabKey.onDown.add(this.focusNextInput, this);

    var enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(function() {
      this.postForm(this.captureForm());
    }, this);

  },
  preload: function() {
    game.load.nineSlice('login-input', 'assets/images/nine-slice-input.png', 25);

  },
  create: function() {
    game.add.existing(this.demoLink);
    this.demoLink.inputEnabled = true;
    this.demoLink.events.onInputUp.add(function() {
      game.state.start("Game");
    });

    this.usernameText = game.add.nineSlice((game.world.centerX - (350/2)), game.world.centerY-50, 'login-input', null, 350, 50);
    this.passwordText = game.add.nineSlice((game.world.centerX - (350/2)), (game.world.centerY+10), 'login-input', null, 350, 50);

    // Add inputs
    game.add.existing(this.usernameTextInput);
    game.add.existing(this.passwordTextInput);

    game.add.existing(this.logo).anchor.setTo(0.5,0.5);
    game.add.existing(this.registerButton);
    game.add.existing(this.loginButton);

  },
  postForm: function(data) {
    var xmlhttp = new XMLHttpRequest();
    var this2 = this;
    xmlhttp.onreadystatechange = function() {
      var this3 = this2;
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        if (xmlhttp.status == 200) {
          var response = JSON.parse(xmlhttp.response);
          Player.name = response.name;
          Player.id = response.id;
          Client.playerConnected();
          this3.game.state.start("Lobby");
        }
        else if (xmlhttp.status == 400) {
          console.error(xmlhttp.response)
        }
        else {
          console.error(xmlhttp.response)
        }
      }
    };
    // Send form ajax request as application/json
    xmlhttp.open("POST", "/login", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));
  },
  captureForm: function() {
    var data = {};
    data.username = this.usernameTextInput.value;
    data.password = this.passwordTextInput.value;
    return data;
  },
  focusNextInput: function() {
    if (Login.currentFocus > -1) {
      var temp = [this.usernameTextInput, this.passwordTextInput];
      temp[Login.currentFocus].endFocus();
      Login.currentFocus += 1;
      if (Login.currentFocus >= temp.length) {
        Login.currentFocus = 0;
      }
      temp[Login.currentFocus].startFocus();
    }
  }
};

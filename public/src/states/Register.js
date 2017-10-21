/*
TODO: Error handing
*/
var Register = function () {};

Register.prototype = {
  init: function() {
    // create images
    this.logo = game.make.sprite(game.world.centerX, 190, 'logo');
    this.loginButton = game.make.sprite(game.world.centerX, (game.world.centerY+190), 'login-btn');
    this.registerButton = game.make.sprite(game.world.centerX - (350/2), (game.world.centerY+190), 'register-btn');


    // Event listener for the register button
    this.registerButton.inputEnabled = true;
    // Toggle mouseover
    this.registerButton.events.onInputDown.add(function() {
      this.registerButton.frame = 1;
    }, this);
    this.registerButton.events.onInputUp.add(function() {
      this.registerButton.frame = 0;
      // ON PRESSING SUBMIT
      var form = this.validateForm();
      if(form.errors.length === 0) {
        this.postForm(form.data);
      } else {
        console.log('display errors');
      }

    }, this);

    // Event listener for the login button
    this.loginButton.inputEnabled = true;
    // Toggle mouseover
    this.loginButton.events.onInputDown.add(function() {
      this.loginButton.frame = 1;
    }, this);
    this.loginButton.events.onInputUp.add(function() {
      this.loginButton.frame = 0;
      this.game.state.start("Login");
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

    this.emailTextInput = game.make.inputField(game.world.centerX - (330/2), (game.world.centerY+20), {
      width: 330,
      font: '17px Futura',
      height: 26,
      max: 320,
      placeHolder: 'Email address',
      placeHolderColor: '#54442F',
      fill: '#54442F',
      cursorColor: '#54442F',
      fillAlpha: 0,
      borderWidth: 0,
      padding: 3
    });

    this.passwordTextInput = game.make.inputField(game.world.centerX-(330/2), (game.world.centerY+80), {
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

    this.confirmPasswordTextInput = game.make.inputField(game.world.centerX-(330/2), (game.world.centerY+140), {
      width: 330,
      font: '17px Futura',
      height: 26,
      max: 25,
      placeHolder: 'Confirm password',
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
    this.emailTextInput.blockInput = false;
    this.passwordTextInput.blockInput = false;
    this.confirmPasswordTextInput.blockInput = false;

    // Keep track of the currently focused input
    Register.currentFocus = -1;
    this.usernameTextInput.focusIn.add(function() {
      Register.currentFocus = 0;
    })
    this.emailTextInput.focusIn.add(function() {
      Register.currentFocus = 1;
    })
    this.passwordTextInput.focusIn.add(function() {
      Register.currentFocus = 2;
    })
    this.confirmPasswordTextInput.focusIn.add(function() {
      Register.currentFocus = 3;
    })

    var tabKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TAB);
    tabKey.onDown.add(this.focusNextInput, this);

  },
  preload: function() {
    //Preload nineslice input field image
    game.load.nineSlice('login-input', 'assets/images/nine-slice-input.png', 25);
  },
  create: function() {
    // Add logo
    game.add.existing(this.logo).anchor.setTo(0.5,0.5);
    // Add input images
    this.usernameText = game.add.nineSlice((game.world.centerX - (350/2)), game.world.centerY-50, 'login-input', null, 350, 50);
    this.emailText = game.add.nineSlice((game.world.centerX - (350/2)), (game.world.centerY+10), 'login-input', null, 350, 50);
    this.passwordText = game.add.nineSlice((game.world.centerX - (350/2)), (game.world.centerY+70), 'login-input', null, 350, 50);
    this.confirmPasswordText = game.add.nineSlice((game.world.centerX - (350/2)), (game.world.centerY+130), 'login-input', null, 350, 50);
    // Add input fields
    game.add.existing(this.usernameTextInput);
    game.add.existing(this.emailTextInput);
    game.add.existing(this.passwordTextInput);
    game.add.existing(this.confirmPasswordTextInput);
    // Add buttons
    game.add.existing(this.registerButton);
    game.add.existing(this.loginButton);
  },
  validateForm: function() {
    var response = {
      data: {},
      errors: []
    }
    // Validate username
    if (this.usernameTextInput.value.length < 3) {
      var error = 'Username cannot be less than 3 characters';
      response.errors.push(error)
    } else {
      if (this.usernameTextInput.value.length > 25) {
        var error = 'Username cannot be more than 25 characters';
        response.errors.push(error)
      } else {
        var validUsername = this.usernameTextInput.value.match(/^[a-zA-Z0-9]+$/);
        if (validUsername == null) {
          var error = 'Username can only contain letters, numbers and hyphens';
          response.errors.push(error)
        } else {
          response.data.username = this.usernameTextInput.value;
        }
      }
    }
    // Validate email address
    if (this.emailTextInput.value == '') {
      var error = 'Email is required';
      response.errors.push(error)
    } else {
      if (this.emailTextInput.value.length < 5) {
        var error = 'Invalid email address';
        response.errors.push(error)
      } else {
        if (this.emailTextInput.value.indexOf('@') === -1 || this.emailTextInput.value.indexOf('.') === -1) {
          var error = 'Invalid email address';
          response.errors.push(error)
        } else {
          response.data.email = this.emailTextInput.value;
        }
      }
    }
    // Validate password
    if (this.passwordTextInput.value.length < 6) {
      var error = 'Password must be at least 6 characters';
      response.errors.push(error)
    } else {
      if (this.confirmPasswordTextInput.value !== this.passwordTextInput.value) {
        var error = 'Passwords do not match';
        response.errors.push(error)
      } else {
        response.data.password = this.passwordTextInput.value;
      }
    }
    return response
  },
  postForm: function(data) {
    var xmlhttp = new XMLHttpRequest();
    var this2 = this;
    xmlhttp.onreadystatechange = function() {
      var this3 = this2;
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        if (xmlhttp.status == 200) {
          console.log(xmlhttp.response)
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
    xmlhttp.open("POST", "/register", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));
  },
  focusNextInput: function() {
    if (Register.currentFocus > -1) {
      var temp = [this.usernameTextInput, this.emailTextInput, this.passwordTextInput, this.confirmPasswordTextInput];
      temp[Register.currentFocus].endFocus();
      Register.currentFocus += 1;
      if (Register.currentFocus >= temp.length) {
        Register.currentFocus = 0;
      }
      temp[Register.currentFocus].startFocus();
    }
  }
};

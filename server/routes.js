var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require("path"),
    router = express.Router(),
    User = require('../models/user');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false }));

// GET route for serving the game
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

//POST route for registering new users
router.post('/register', function (req, res, next) {
  console.log('registration recieved');
  // Validate username
  if (req.body.username.length < 3) {
    var err = new Error('Username is too short');
    console.log(err);
    err.status = 400;
    res.send('Username is too short');
    return next(err);
  } else {
    if (req.body.username.length > 25) {
      var err = new Error('Username is too long');
      err.status = 400;
      res.send('Username is too long');
      return next(err);
    } else {
      var validUsername = req.body.username.match(/^[a-zA-Z0-9]+$/);
      if (validUsername == null) {
        var error = 'Username can only contain letters, numbers and hyphens';
        var err = new Error(error);
        err.status = 400;
        res.send(error);
        return next(err);
      }
    }
  }
  // Validate email address
  if (req.body.email.value == '') {
    var error = 'Email is required';
    var err = new Error(error);
    err.status = 400;
    res.send(error);
    return next(err);
  } else {
    if (req.body.email.length < 5) {
      var error = 'Invalid email address';
      var err = new Error(error);
      err.status = 400;
      res.send(error);
      return next(err);
    } else {
      if (req.body.email.indexOf('@') === -1 || req.body.email.indexOf('.') === -1) {
        var error = 'Invalid email address';
        var err = new Error(error);
        err.status = 400;
        res.send(error);
        return next(err);
      }
    }
  }
  // Validate password
  if (req.body.email.length < 6) {
    var error = 'Password must be at least 6 characters';
    var err = new Error(error);
    err.status = 400;
    res.send(error);
    return next(err);
  } else {
    if (req.body.email.value !== req.body.email.value) {
      var error = 'Passwords do not match';
      var err = new Error(error);
      err.status = 400;
      res.send(error);
      return next(err);
    }
  }
  console.log('No errors, creating user');

  var userData = req.body;
  User.create(userData, function (error, user) {
    if (error) {
      return next(error);
    } else {
      req.session.userId = user._id;
      return res.send('Successfully regsitered');
    }
  });

})

//POST route for logging in users
router.post('/login', function (req, res, next) {
  User.authenticate(req.body.username, req.body.password, function (error, user) {
    if (error || !user) {
      var err = new Error('Incorrect username or password.');
      err.status = 401;
      return next(err);
    } else {
      var player = {
        id: user._id,
        name: user.username
      };
      req.session.userId = user._id;
      return res.send(player);
    }
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = router;

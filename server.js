var express = require('express'),
    app = express();
// Database
var bodyParser = require('body-parser'), // For parsing incoming requests
    mongoose = require('mongoose'), // Simplifying interactions with MongoDb
    session = require('express-session'), // Handling sessions
    MongoStore = require('connect-mongo')(session); //Store sessions in Mongodb
// Sockets
var server = require('http').Server(app),
    io = require('socket.io').listen(server);

// Connect to the database
mongoose.connect('mongodb://localhost/hex', {
  useMongoClient: true
});
var db = mongoose.connection;
//handle database connection error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // console.log('Connected to database');
});

// Handle user sessions
app.use(session({
  secret: 'open sesame',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serving static files
app.use(express.static(__dirname + '/public'));

// include routes
var routes = require('./server/routes');
app.use('/', routes);

// Keep track of the last id assigned to a new player
server.lastPlayderID = 0;

// Listens to port 8081
server.listen(8081, function() {
  console.log('Listening on '+server.address().port);
});

// Keep track of the players that are connected
var playersConnected = {};
var nowTime = new Date().getTime();

io.on('connection', function(socket) {
  // Called from the server side when the user has been authenticated
  socket.on('playerConnected', function(data) {
    var player = data.player;
    var playerId = player._id;
    console.log('player connected: ' + playerId);

    player.socket = socket.id;
    player.connected = nowTime;

    playersConnected[playerId] = player;
  });
  // Called from the client when the vistor enters the lobby
  socket.on('playerConnectedToLobby', function(player) {
    // Return all of the other players in the lobby to the client that just connected
    socket.emit('lobbyAllPlayers', getAllPlayers());

    // send a message to all players excluding the triggerer
    socket.broadcast.emit('playerConnectedToLobby');
    // log the player to the terminal
    console.log(playersConnected)
    console.log(playersConnected[player.id].name+' connected to the lobby');

    // Listen for players sending messages to the lobby
    socket.on('playerSentLobbyMessage', function(message) {
      // Send the message to all the connected sockets
      socket.broadcast.emit('playerSentLobbyMessage', player);
      // Log the message and player to the terminal
      console.log(player.name)
      console.log(message)

    });
  });
});

// Loop through the sockets and return all the connected players
function getAllPlayers(){
  var players = [];
  Object.keys(io.sockets.connected).forEach(function(socketID){
    var player = io.sockets.connected[socketID].player;
    if(player) players.push(player);
  });
  return players;
}

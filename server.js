var express = require('express'),
    app = express();
// Database
var bodyParser = require('body-parser'), // For parsing incoming requests
    mongoose = require('mongoose'), // Simplifying interactions with MongoDb
    session = require('express-session'), // Handling sessions
    MongoStore = require('connect-mongo')(session); // Store sessions in Mongodb
// Sockets
var server = require('http').Server(app),
    io = require('socket.io').listen(server),
    port = process.env.PORT || 8081;
// Misc
const uuidv1 = require('uuid/v1'); // Generates unique universal random identifies for game ids.
const loop = require('node-gameloop'); // Handles server client ticks

// Connect to the database
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/hex', {
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

// Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(__dirname + '/public'));

// Include routes
var routes = require('./server/routes');
app.use('/', routes);

// Keep track of the last id assigned to a new player
server.lastPlayderID = 0;

// Listens to port
server.listen(port, function() {
  console.log('Listening on '+server.address().port);
});

// Keep track of the players that are connected and where they are connected
var playersConnected = {},
    playersInLobby = {},
    playersLookingForMatch = {},
    playersWaitingForMatch = {};

// Keep track of matches
var gamesInProgress = {};

// Keep track of time
var nowTime = new Date().getTime(),
    nowMuTime = Math.round(nowMuTime / 1000),
    matchSearchTimeout = 30; // seconds

io.on('connection', function(socket) {
  // Called from the client when the vistor enters the lobby
  socket.on('playerConnectedToLobby', playerConnectedToLobby);
  // Listen for players sending messages to the lobby
  socket.on('playerSentLobbyMessage', playerSentLobbyMessage);
  // Called from the client side when the user has been authenticated
  socket.on('playerConnected', playerConnected);
  // Called when the client starts finding a match
  socket.on('findMatchStart', findMatchStart);
  // Called when the client cancels finding a match
  socket.on('findMatchCancel', findMatchCancel);
  // Called when a guest is requesting to connect with a host
  socket.on('joinHostGame', joinHostGame);

  function playerConnected(player) {
    console.log(player.name+ ' connected');

    player.socket = socket.id;
    player.connected = nowTime;
    // Keeping track of the connected players
    playersConnected[player.id] = player;
    // console.log(playersConnected);
  }

  function playerConnectedToLobby(player) {
    playersInLobby[player.id] = playersConnected[player.id];
    var confirmedPlayer = {
      name: playersInLobby[player.id].name,
      id: playersInLobby[player.id].id
    }
    // Return all of the other players in the lobby to the client that just connected
    socket.emit('lobbyAllPlayers', getAllPlayers());
    // send a message to all players excluding the triggerer
    socket.broadcast.emit('playerConnectedToLobby', confirmedPlayer);
    // log the player to the terminal
    console.log(playersConnected[player.id].name+' connected to the lobby');
  }

  function playerSentLobbyMessage(player, message) {
    var confirmedPlayer = {
      name: playersInLobby[player.id].name,
      id: playersInLobby[player.id].id,
      message: message
    }
    // Send the message to all the connected sockets
    socket.broadcast.emit('playerSentLobbyMessage', confirmedPlayer);
    // Log the message and player to the terminal
    console.log(confirmedPlayer);
  }

  function findMatchStart(player) {
    var gameId = uuidv1();
    // console.log(player)
    // Incase the server has been rebooted since hte users started their session
    if (playersConnected == {}) {
      // TODO: emit server reboot and return.
    }

    player = playersConnected[player.id];

    // send back the id of the game that has been created and add the id to the players local state
    socket.emit('findMatchStarted', { gameId: gameId });

    // Create a 'host' room for the player based on the gameId.
  	// If the player ends up being the 'join' the player, they will leave this room and join the 'host' room
  	this.join(gameId);
    // console.log(player);
    playersLookingForMatch[player.id] = {
      gameId: gameId,
      startTime: nowTime,
      startMuTime: nowMuTime,
      player: player,
      matchFound: false,
      socket: socket.id
    }

    console.log(player.name +' created game:'+gameId+' | find match start');
  }

  function findMatchCancel(player) {
    if (!playersLookingForMatch[player.id]) { return; }
    var gameId = playersLookingForMatch[player.id].gameId;
  	this.leave(gameId);
    console.log(player.name+': Cancelled match making');
    // remove the player from the playersLookingForMatch array
  	delete playersLookingForMatch[player.id];
  }

  function joinHostGame(data) {
    let gameId = data.gameId;
	      playerId = data.playerId,
        match = gamesInProgress[gameId],
	      guest = playersWaitingForMatch[playerId],
        min = 0,
        max = 999999;

    // This socket will now join this game 'room'
    this.join(gameId);

    guest.guest = true;

    match.players[playerId] = guest;
    match.playerIds.push(playerId);
    match.joinedPlayers += 1;

    console.log(playerId + ' joined host game | ' + gameId);

    if(match.joinedPlayers === match.maxPlayers) {
      // create a quick random test to determine which player goes first (in a turn-based game)
  		var coinFlip = Math.floor(Math.random() * (max - min + 1)) + min;
  		var hostId = match.playerIds[0];
  		var guestId = match.playerIds[1];

  		match.players[hostId].goesFirst = true;
  		match.players[guestId].goesFirst = false;

  		if (coinFlip < 500000) {
    		match.players[hostId].goesFirst = false;
    		match.players[guestId].goesFirst = true;
  		}


  		// Save the game back to the database. This is critical because we need to detect
  		// if there is a game in progress if either client reloads their browser page.
  		saveGameInProgress(gameId, match);

  		// alert both clients that the game is ready to start
  		matchBeginGame(gameId, match);

  		// the match is fully completed on the server, so remove the players from waitingOnMatch array
  		delete playersWaitingForMatch[hostId];
  		delete playersWaitingForMatch[guestId];
    }
  }

});

// Set the loop to 30fps
var frameCount = 0;
var revolution = loop.setGameLoop(function(delta) {
	// `delta` is the delta time from the last frame
	serverLoop(frameCount++, delta);
}, 1000 / 30);


// The server loop, all loop base directives can be added into this function
function serverLoop(frame, delta) {

  // update the time and microtime
	nowMuTime = new Date().getTime();
	nowTime = Math.round(nowMuTime / 1000);

  // if any players are currently looking for a match, run the findMatch function
	if (playersLookingForMatch != {}) {
		findMatchLoop();
	}
}

// helper function to save or update the game to the database
function saveGameInProgress(gameId, match) {
	gamesInProgress[gameId] = match;

  /* TODO: track 1000 game histories in db */
}

// alert both clients that the game is ready to start
function matchBeginGame(gameId, match) {
	// emit the begin game event to both clients
	io.to(gameId).emit('beginMatch', { match: match });
}

// Handle players that are looking for a match
function findMatchLoop() {
  // Loop through all players looking for a match
  for (var playerId in playersLookingForMatch) {

    var player = playersLookingForMatch[playerId];

    // Timeout the player and continue to the next if they have been searching for too long
    if (nowTime > (player.startTime + matchSearchTimeout)) {
			findMatchTimeout(playerId);
			continue;
		}

    if (player.matchFound) {
      continue;
    } else {
      // Find potentional opponents
      for (var opponentId in playersLookingForMatch) {

        var opponent = playersLookingForMatch[opponentId];

				// We treat the 'host' player as the player who first initiated the findMatch,
				// so the 'join' player must always come later in time.
        if (opponent.startMuTime < player.startMuTime
					&& opponent.matchFound == false) {

					player.matchFound = true;
					opponent.matchFound = true;

					// match found, trigger it
					matchFound(opponent, player);

				}
      }
    }
  }
}


function matchFound(host, guest) {

  // Using the gameID of the host
  var gameId = host.gameId;
  // Add the host key to the host
  host.host = true;

	// emit the event to the guest player that tells the client to join the host player's game
	io.to(guest.socket).emit('hostGameFound', gameId);

  console.log(guest.player.id + ': sending notice to join game | ' + gameId);

  // Create the match object
	var match = {
		startMuTime: nowMuTime,
		startTime: nowTime,
		endMuTime: 0,
		endTime: 0,
		gameId: gameId,
		joinedPlayers: 1,
		maxPlayers: 2,
		playerIds: [],
		players: {},
		turns: [],
	};

  // Add the host player to the game object
	match.players[host.player.id] = host;
	match.playerIds.push(host.player.id);

  // Add the match to the games in progress object
  gamesInProgress[gameId] = match;

  // Move the players to the playersWaitingForMatch object until the match is completed
	playersWaitingForMatch[host.player.id] = playersLookingForMatch[host.player.id];
	playersWaitingForMatch[guest.player.id] = playersLookingForMatch[guest.player.id];

  // finally, remove both players from the lookingForMatch object which stops the server loop from matching them
	delete playersLookingForMatch[host.player.id];
	delete playersLookingForMatch[guest.player.id];
}

// Handle match-making timeouts
function findMatchTimeout(playerId) {
  console.log(playersConnected[playerId].name+': Timed out of match making');

  var gameId = playersLookingForMatch[playerId].gameId;
  var socket = playersLookingForMatch[playerId].socket;

  // Emit the `findMatchTimeout` message to display the timeout in the front end
  io.to(socket).emit('findMatchTimeout');

  // remove the player from the lookingForMatch object
	delete playersLookingForMatch[playerId];
}

// Loop through the sockets and return all the connected players
function getAllPlayers() {
  var players = [];
  Object.keys(io.sockets.connected).forEach(function(socketID){
    var player = io.sockets.connected[socketID].player;
    if(player) players.push(player);
  });
  return players;
}

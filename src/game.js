
// Construct a new phaser game
var game = new Phaser.Game(800, 680, Phaser.AUTO, 'Container', { preload: preload, create: create});

// Game map 0 = EMPTY, 1 Grass, 2 Stone
var tileMap = [
  [0,0,0,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,0],
  [2,1,1,1,1,1,1,1,1,1,1,1,2],
  [1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,0,0,0]
];

var bmpText,
    tileMouseOver,
    directionalArrows,
    arrowsArray = [],
    player1 = {
      number: 1,
      location: {},
      speed: 1,
      cursor: {}
    },
    player2 = {
      number: 2,
      location: {},
      speed: 1,
      cursor: {}
    },
    debug = false,
    tileHeight = 61,
    tileWidth = 52,
    playerSpriteSize = 32,
    playerTurn = 1;
// Preload all of our game assets
function preload() {
  game.load.bitmapFont('font', 'assets/font.png', 'assets/font.xml');
  game.load.image('tile', 'assets/tile.png');
  game.load.image('tile-grass', 'assets/tile-grass.png');
  game.load.image('tile-stone', 'assets/tile-stone.png');
  game.load.image('interface-mouseover-tile', 'assets/interface-mouseover-tile.png');
  game.load.spritesheet('interface-direction-arrow', 'assets/interface-direction-arrow.png', 16, 16 );
  game.load.image('player1-cursor', 'assets/player1-cursor.png');
  game.load.spritesheet('sprite-sheet', 'assets/sprite-sheet.png', 32, 32);
}

function create() {
  // set the background of the canvas to dracula bg
  game.stage.backgroundColor = '#282a36';
  if (debug) {
    debugGroup = game.add.group();
  }
  // execute create level function
  createMap();
  addPlayers();
  createInterface();
  start();
  if (debug) {
    game.world.bringToTop(debugGroup);
  }
}

function createMap() {
  // grid is now an object of game objects
  grid = game.add.group();
  // Variables we will use to layout the tiles in the grid
  var verticalOffset = tileHeight*3/4,
      horizontalOffset = tileWidth,
      startX,
      startY,
      startXInit = tileWidth/2,
      startYInit = tileHeight/2,
      tile;

  // loop through the arrays within the tile map array
  for (var i = 0; i < tileMap.length; i++) {
    // if i modulous 2. i.e is it odd or even set the starting x-axis variable
    // to indent the grid on every other row
    i%2 == 0 ? startX = startXInit : startX = 2*startXInit;
    //Set he starting y axis to the loop index times by the row count
    startY = startYInit+(i*verticalOffset);

    // Loop through each of the values in our row arrays
    for (var j = 0; j < tileMap[0].length; j++) {
      if (debug) {
        var coordinateText = game.add.text(startX, startY, i+","+j);
        coordinateText.font = "arial";
        coordinateText.fontSize = 12;
        debugGroup.add(coordinateText);
      }
      // if tileMap [row] [column] does equal 1
      if(tileMap[i][j] == 1){
        // construct a new time to our game at the location that we have just calculated using our custom game pbject from tile.js
        tile = new Tile(game, startX, startY, 'tile-grass', false, i, j, tileMap[i][j]);
        // Add the new tile to our grid group
        grid.add(tile);
      } else if(tileMap[i][j] == 2){
        // construct a new time to our game at the location that we have just calculated using our custom game pbject from tile.js
        tile = new Tile(game, startX, startY, 'tile-stone', false, i, j, tileMap[i][j]);
        // Add the new tile to our grid group
        grid.add(tile);
      }
      // increment the horizontal coord
      startX += horizontalOffset;
    }

  }
  // Set the coordinates of the grid group
  grid.x = 50;
  grid.y = 50;
}

// Add our players to their starting positions
function addPlayers() {
  // TO DO: MAKE SPRITE SHEET WITH ONLY 6 DIRECTIONS THAT CORRESONDS TO PLAYER OBJECT

  player1Sprite = game.add.sprite(player1.location.x, player1.location.y, 'sprite-sheet', 26, grid)
  player1Sprite.anchor.setTo(0.5, 0.5);
  player2Sprite = game.add.sprite(player2.location.x, player2.location.y, 'sprite-sheet', 14, grid)
  player2Sprite.anchor.setTo(0.5, 0.5);
}

function createInterface() {
  turnText = game.add.text(0, 0, "Player "+playerTurn+"'s turn", {
        font: "16px Menlo",
        fill: "#8be9fd"
  });

  phaseText = game.add.text(0, 25, "Choose Direction", {
        font: "16px Menlo",
        fill: "#8be9fd"
  });
  // add some interface sprites and hide them for later use
  // Tile Cursor
  tileMouseOver = game.add.sprite(0, 0, 'interface-mouseover-tile', 0, grid);
  tileMouseOver.anchor.setTo(0.5, 0.5);
  tileMouseOver.visible = false;
  // Active player cursor
  player1.cursor = game.add.sprite(0, 0, 'player1-cursor', 0, grid);
  player1.cursor.anchor.setTo(0.5, 0.5);
  player1.cursor.visible = false;
  // Directional arrows
  directionalArrows = game.add.group(grid, 'directionalArrows');
  directionalArrows.visible = false;

  // Right         game, x, y, image, angle, name
  arrow1 = new Arrow(game, (tileWidth + 25), (tileHeight/2), 'interface-direction-arrow', 0, 'arrow1');
  // Bottom Right
  arrow2 = new Arrow(game, tileWidth, (tileHeight+12.5), 'interface-direction-arrow', 60, 'arrow2');
  // Bottom left
  arrow3 = new Arrow(game, 0, tileHeight+12.5, 'interface-direction-arrow', 120, 'arrow3');
  // Left
  arrow4 = new Arrow(game, (-25), (tileHeight/2), 'interface-direction-arrow', 180, 'arrow4');
  // Top left
  arrow5 = new Arrow(game, 0, -12.5, 'interface-direction-arrow', 240, 'arrow5');
  // Top right
  arrow6 = new Arrow(game, tileWidth, -12.5, 'interface-direction-arrow', 300, 'arrow6');

  console.log(directionalArrows)
  console.log(arrowsArray)
}

function getNeighbours(location) {
  // // if((location.i % 2) === 0) {
  // //
  // // }
  // var neighbours = [];
  // // Common neighbours
  // // Top right on even. Top left on odd.
  // var tempi = location.i - 1;
  // var tempj = location.j;

}
// //first add common elements for odd & even rows
//     var tempArray=[];
//     var newi=i-1;//tr even tl odd
//     var newj=j;
//     populateNeighbor(newi,newj,tempArray);
//     newi=i;
//     newj=j-1;//l even odd
//     populateNeighbor(newi,newj,tempArray);
//     newi=i+1;
//     newj=j;//br even bl odd
//     populateNeighbor(newi,newj,tempArray);
//     newi=i;//r even odd
//     newj=j+1;
//     populateNeighbor(newi,newj,tempArray);
//     //now add the different neighbours for odd & even rows
//     if(i%2==0){
//         newi=i-1;
//         newj=j-1;//tl even
//         populateNeighbor(newi,newj,tempArray);
//         newi=i+1;//bl even
//         populateNeighbor(newi,newj,tempArray);
//     }else{
//         newi=i-1;
//         newj=j+1;//tr odd
//         populateNeighbor(newi,newj,tempArray);
//         newi=i+1;//br odd
//         populateNeighbor(newi,newj,tempArray);
//     }
//
//     return tempArray;

function displayAvailableDirections(player) {

  /*
       5 /\ 6
      4 |  | 1
       3 \/ 2
  */

  var availableDirections = [];
  var tempDirection;

  currentDirection = player.location.direction;
  availableDirections.push(currentDirection);

  for (var v = 0; v < player.speed; v++) {
    // Turning Clockwise
    tempDirection = currentDirection + player.speed;
    if(tempDirection > 6) tempDirection = tempDirection - 6;
    availableDirections.push(tempDirection);

    // Turning Anti-clockwise
    tempDirection = currentDirection - player1.speed;
    if(tempDirection < 1) tempDirection = tempDirection + 6;
    availableDirections.push(tempDirection);
  }

  directionalArrows.x = player1.location.x - (tileWidth/2);
  directionalArrows.y = player1.location.y - (tileHeight/2);
  directionalArrows.visible = true;

  for (var g = 0; g < availableDirections.length; g++) {
    var arrowIndex = availableDirections[g];
    arrowsArray[arrowIndex-1].visible = true;
  }

  // Make the available diretions visible
  directionalArrows.visible = true;
  // display the direction with an arrow or with some other ui element

  // once the user selects a direction update the player sprite to face in that direction and update the player object
}

function start() {
  if(playerTurn === 1) {
    player1.cursor.x = player1.location.x;
    player1.cursor.y = player1.location.y;
    player1.cursor.visible = true;
    displayAvailableDirections(player1)
    // getNeighbours(player1.location);
  }
}

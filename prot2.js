//Initiate variables
var ball;
var paddle;
var computer;
var bricks;
var newBrick;
var brickInfo;
var scoreText;
var score;
var highScoreText;
var highScore;
var sound = {};
var speed;
var playButton;
var gameStarted = false;

var game = new Phaser.Game(300, 400,
    Phaser.AUTO, null, {
        preload: preload,
        create: create,
        update: update
});

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';
    
    //Preload sprites
    game.load.image('ball', 'img/ball.png');
    game.load.image('paddle', 'img/paddle.png');
    game.load.image('computer', 'img/computer.png');
    game.load.image('brick', 'img/brick.png');
    
    //Preload audio
    game.load.audio('hit', 'sound/hit.wav');
    game.load.audio('piano', 'sound/piano.mp3');
    
    //Preload play button
    game.load.spritesheet('button', 'img/button.png', 120, 40);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //Create ball
    ball = game.add.sprite(150, 200, 'ball');
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    
    //Add sound effects
    if (gameStarted == false || sound.piano.isPlaying == false){
        sound.piano = game.add.audio('piano', 1, true);
        sound.piano.play();
        sound.hit = game.add.audio('hit');
    }
    
    //Player loses
    game.physics.arcade.checkCollision.down = false;
    
    //Computer loses
    game.physics.arcade.checkCollision.up = false;
    
    //Ball is out of play
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(function () {
        if (ball.y > game.world.height / 2 || ball.y < game.world.height / 2) {
            endGame();
        }
    }, this);
    
    //Create paddle
    paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'paddle');
    paddle.anchor.set(0.5, 1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;
    
    //Initialise bricks
    initBricks()
    
    //Create computer
    computer = game.add.sprite(game.world.width * 0.5, 5, 'computer');
    computer.anchor.set(0.5, 0.5);
    game.physics.enable(computer, Phaser.Physics.ARCADE);
    computer.body.immovable = true;
    
    //Create score text
    score = 0;
    scoreText = game.add.text(140, 200, score, { font: '18px Consolas', fill: '#000000' });
    
    //Highscore function
    if (gameStarted == false) {
        playButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', startGame, this, 1, 0, 2);
        playButton.anchor.set(0.5);
        highScore = 0;
    } else if (score > highScore) {
        highScore = score;
    }
}


function update() {
    
    if (gameStarted == true) {
        game.physics.arcade.collide(ball, paddle, ballHitPaddle);
        game.physics.arcade.collide(ball, computer, ballHitComputer);
        game.physics.arcade.collide(ball, bricks, brickHit);
        paddle.x = game.input.x || game.world.width * 0.5;
    }

    if (score >= highScore){
        highScore = score;
        //highScoreText.setText('highscore: ' + highScore);
    }

    var diff = ball.x - computer.x;
    var mid = game.world.width / 2;
    var tall = game.world.height / 2;

    // Returns computer back to the middle
    if (computer.x < mid && ball.y > mid) {
        computer.x += 0.8;
    } else if (computer.x > mid && ball.y > mid) {
        computer.x -= 0.8;
    }
    
    // Computer 'AI' function
    if (diff > 5 && ball.y < tall) {
        if (speed < 8) {
            computer.x += 1.8;
            
        } else if (speed < 15) {
            computer.x += 2.2;
            
        } else if (speed < 22) {
            computer.x += 2.6;
            
        } else {
            computer.x += 1.2;
        }
        
    } else if (diff < 5 && ball.y < tall) {
        if (speed < 8) {
            computer.x -= 1.8;
            
        } else if (speed < 15) {
            computer.x -= 2.2;
            
        } else if (speed < 22) {
            computer.x -= 2.6;
            
        } else {
            computer.x -= 1.2;
        }
    }
}

function startGame(){
    // Function for first time initialisation which will allow game restarts
    playButton.destroy();
    ball.body.velocity.set(150, -150);
    gameStarted = true;
    speed = 0;
}

function endGame(){
    /*
    * Cleans sprites for respawning later, also serves as the 'waiting room'
    * for the game to the restart function
    */
    computer.kill();
    paddle.kill();
    ball.kill();
    bricks.kill();
    scoreText.kill();
    highScoreText = game.add.text(85, 150, 'highscore: ' + highScore, {font: '18px Consolas', fill: '#000000' });
    
    playButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', restartGame, this, 1, 0, 2);
    playButton.anchor.set(0.5);
}

function restartGame(){
    highScoreText.kill();
    create();
    startGame();
}

function initBricks() {
    brickInfo = { width: 30, height: 5,
        count: { row: 3, col: 7 },
        offset: { top: 60, left: 30 },
        padding: 10
    };
    
    bricks = game.add.group();
    
    for (var c=0; c<brickInfo.count.col; c++) {
        for(var r=0; r<brickInfo.count.row; r++) {
            var brickX = (c*(brickInfo.width+brickInfo.padding)) + brickInfo.offset.left;
            var brickY = (r*(brickInfo.height+brickInfo.padding)) + brickInfo.offset.top; 
            newBrick = game.add.sprite(brickX, brickY, 'brick');
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            newBrick.anchor.set(0.5);
            bricks.add(newBrick);
        }
    }
}

function brickHit(ball, brick) {
    speed+=1;
    brick.kill();
    sound.hit.play();
    score += 10;
    scoreText.setText(score);
    if (speed == 6) {
        score+=20;
    } else if (speed == 13) {
        score+=40;
    } else if (speed == 20){
        score+=80;
    }
}

function ballHitPaddle(ball, paddle) {
    ball.body.velocity.x = -1*5*(paddle.x-ball.x);
    sound.hit.play();
}

function ballHitComputer(ball, computer){
    ball.body.velocity.x++;
    sound.hit.play();
}
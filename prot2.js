var game = new Phaser.Game(300, 400, Phaser.AUTO, null, {preload: preload, create: create, update: update} );

//Initialise variables
var ball;
var paddle;
var computer;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';

    game.load.image('ball', 'img/ball.png');
    game.load.image('paddle', 'img/paddle.png');
    game.load.image('computer', 'img/computer.png');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    ball = game.add.sprite(50, 50, 'ball');
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.body.velocity.set(150, -150);
    
    //Player loses
    game.physics.arcade.checkCollision.down = false;
    
    //Computer loses
    game.physics.arcade.checkCollision.up = false;
    
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(function(){
        if(ball.y > game.world.height/2){
            alert("Computer wins");
        }
        else if(ball.y < game.world.height/2){
            alert("Player wins");
        }
        //alert('Game over!');
        //location.reload();
    }, this);
    
    paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
    paddle.anchor.set(0.5,1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;
    
    computer = game.add.sprite(game.world.width*0.5, 5, 'computer');
    computer.anchor.set(0.5, 0.5);
    game.physics.enable(computer, Phaser.Physics.ARCADE);
    computer.body.immovable = true;
}

function update() {
    game.physics.arcade.collide(ball, paddle);
    paddle.x = game.input.x || game.world.width*0.5;
    
    game.physics.arcade.collide(ball, computer);

    var diff = ball.x - computer.x;
    
    if(diff > 5 && ball.y < game.world.height/2){
        computer.x += 1.75;
    }
    else if (diff < 5 && ball.y < game.world.height/2){
        computer.x -= 1.75;
    }
}
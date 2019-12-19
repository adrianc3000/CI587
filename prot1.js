//Canvas dimensions
const WIDTH = 300;
const HEIGHT = 300;
let aniFrameID = 0;
let gameOver;
let paddleLeft = false;
let paddleRight = false;
let paddle2Left = false;
let paddle2Right = false;


//Paddle dimensions
let paddle = {
    width: WIDTH / 4,
    height: 10,
    y: 0,
    x: 0,
    dx: 3,
    dy: 3
};

let paddle2 = {
    width: WIDTH / 4,
    height: 10,
    y: 0,
    x: 0,
    dx: 3,
    dy: 3
}

//Ball dimensions
let ball = {
    x: 0,
    y: 0,
    radius: 10,
    dx: 2,
    dy: 1
};

function init(){
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    gameOver = false;

    paddle.y = HEIGHT - paddle.height;
    paddle.x = WIDTH / 2 - paddle.width / 2;

    paddle2.y = 0;
    paddle2.x = WIDTH / 2 - paddle2.width / 2;
    console.log("Paddle 2 Height: " + paddle2.height + " and HEIGHT " + HEIGHT + " and Paddle 2 Y " + paddle2.y);
    
    ball.x = HEIGHT / 2;
    ball.y = WIDTH / 2;
    ball.dx = parseFloat(ball.dx);
    ball.dy = parseFloat(ball.dy);

    window.addEventListener('keyup', doKeyUp, true);
    window.addEventListener('keydown', doKeyDown, true);

    draw();
}

function draw(){ 
    ctx.clearRect(0, 0, 300, 300);
    ctx.fillStyle = "red";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.fillStyle = "green"; // Two player or Computer
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
    ctx.fill();

    ball.x += ball.dx;
    ball.y += ball.dy;
    checkCollide();

    if (paddleLeft) {
        if (paddle.x > 0) {
            paddle.x -= paddle.dx;
        }
    } else if (paddleRight) {
        if (paddle.x + paddle.width < WIDTH) {
            paddle.x += paddle.dx;
        }
    }

    if (paddle2Left) {
        if (paddle2.x > 0) {
            paddle2.x -= paddle2.dx;
        }
    } else if (paddle2Right) {
        if (paddle2.x + paddle2.width < WIDTH) {
            paddle2.x += paddle2.dx;
        }
    }

    if (!gameOver){
    aniFrameID = requestAnimationFrame(draw);
    }
}

function checkCollide(){
    //ball collision with sides
    if (ball.x + ball.radius > WIDTH || ball.x - ball.radius < 0){
        ball.x -= 2 * ball.dx;
        ball.dx = -ball.dx;
    }
    //ball collision with top and bottom
    /*
    if (ball.y + ball.radius > HEIGHT || ball.y - ball.radius < 0){
        ball.y -= 2 * ball.dy;
        ball.dy = -ball.dy;
    }*/

    //player 2 loses side
    if (ball.y + ball.radius > HEIGHT){
        gameOver = true;
        console.log("green wins");
    }
    else if (ball.y - ball.radius < 0){
        console.log("red wins");
        gameOver = true;
    }

    if ((ball.y + ball.radius > paddle.y) && (ball.x + ball.radius > paddle.x) && (ball.x - ball.radius < paddle.x + paddle.width)){
        ball.y -= 2 * ball.dy;
        ball.dy = -ball.dy;
    }
    
    if ((ball.y - ball.radius < paddle.height) && (ball.x + ball.radius > paddle2.x) && (ball.x - ball.radius < paddle2.x + paddle2.width)){
        ball.y -= 2 * ball.dy;
        ball.dy = -ball.dy;
    }
}

function doKeyDown(evt) {
    if (evt.keyCode === 37){
        paddleLeft = true;
    } else if (evt.keyCode === 39){
        paddleRight = true;
    }

    if (evt.keyCode === 65){
        paddle2Left = true;
    } else if (evt.keyCode === 68){
        paddle2Right = true;
    }
} // end of doKeyDown()

function doKeyUp(evt) {
    if (evt.keyCode === 37) {
        paddleLeft = false;
    } else if (evt.keyCode === 39) {
        paddleRight = false;
    }

    if (evt.keyCode === 65){
        paddle2Left = false;
    } else if (evt.keyCode === 68){
        paddle2Right = false;
    }
} // end of doKeyUp()
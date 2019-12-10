//Canvas dimensions
const WIDTH = 300;
const HEIGHT = 300;

//Paddle dimensions
let paddle = {
    width: WIDTH / 4,
    height: 10,
    y: 0,
    x: 0,
}

function init(){
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");

    paddle.y = HEIGHT - paddle.height;
    paddle.x = WIDTH / 2 - paddle.width / 2;

    draw();
}

function draw(){ 
    ctx.clearRect(0, 0, 300, 300);
    ctx.fillStyle = "red";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.fillStyle = "green";
    ctx.fillRect(paddle.x, HEIGHT - paddle.y - 9, paddle.width, paddle.height);
}

init(); //Temporary init() until button listeners are implemented
var pause=false;
var canvas, context;
var player;
const playerHeight = 60;
const groundHeight = 120;
const CHARGE_WIDTH = 500;
const CHARGE_HEIGHT = 40;
const GRAVITY = 0.15;
var groundY;
var left, right;
var playerArrows = [];
var enemy = [];
var timer = 0;
var enemyHP;
var charge = 0;
var charging = false;
var CHARGE_SPEED = 1;
var mouseX, mouseY;

function setupGame() {
    canvas = document.getElementById("world");
    context = canvas.getContext("2d");
    const fps = 60;
    groundY = canvas.height - groundHeight;

    drawGround();
    drawChargeBar();

    player = new Component("#AAA",0,groundY-playerHeight,30,playerHeight,7);
  
    /* for (var i = 0; i < 5; i++){
        enemy[i]= new Component("#F0F",i*80+20,0,40,40);
        enemy[i].HP=enemyHP;
    } */

    setInterval(function() {gameLoop();}, 1000/fps);
}

/** graphical object that can be drawn and moved */

function drawGround(){
    context.fillStyle = "#638e51";
    context.fillRect(0, groundY, canvas.width, groundHeight);
}

function drawChargeBar(){
    context.lineWidth = "6";
    context.strokeStyle = "#000";
    context.fillStyle = "#00F";
    context.fillRect(CHARGE_WIDTH/4, canvas.height-2*CHARGE_HEIGHT, CHARGE_WIDTH*charge/100, CHARGE_HEIGHT);
    context.strokeRect(CHARGE_WIDTH/4, canvas.height-2*CHARGE_HEIGHT, CHARGE_WIDTH, CHARGE_HEIGHT);
}

class Component  {
    constructor (color, x, y, width, height, speed){
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.centerX = this.x + this.width/2;
        this.centerY = this.y + this.height/2;
        this.speed = speed;
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction){
        this.x+=direction*this.speed;
    }
}

class Arrow extends Component{
    constructor (color, x, y, width, height, speed, dx, dy){
        super(color, x, y, width, height, speed);

        let sum = Math.abs(dx) + Math.abs(dy);
        this.xVel = speed * dx/sum/3;
        this.yVel = speed * dy/sum/3;
        
        this.angle = Math.atan(this.yVel/this.xVel);

        console.log("velocity x,y " + this.xVel + ", " + this.yVel);
    }

    draw() {
        context.fillStyle = this.color;
        context.lineWidth = "1";
 /*       this.x = this.centerX - this.width/2;
        this.y = this.centerY - this.height/2;*/

        context.translate(this.centerX, this.centerY);
        context.rotate(this.angle);

        context.strokeRect(-this.width/2, -this.height/2, this.width, this.height);

        //reset the canvas to default
        context.rotate(-this.angle);
        context.translate(-this.centerX, -this.centerY);
    }

    move(direction){
        this.centerX+=this.xVel;
        this.centerY+=this.yVel;
        this.angle = Math.atan(this.yVel/this.xVel);
        //apply gravity to y component
        this.yVel+=GRAVITY;
    }
}

function shootArrow(){
    //arrow starts on the right side of player model, at middle height
    let xOrigin = player.x + player.width;
    let yOrigin = player.y + player.height/2;
    let dx = mouseX - xOrigin;
    let dy = mouseY - yOrigin;

    console.log("arrow shot dx,dy: " + dx + ", " + dy);
    playerArrows.push(new Arrow("#F00",xOrigin,yOrigin,20,3,charge, dx, dy));
    charge = 0;    
}

function movePlayer(){
    if (left) {
        if(player.x - player.speed < 0){
            player.x = 0;
        }

        else{
            player.move(-1);
        }
    }

    if (right) {
        if(player.x + player.speed + player.width > canvas.width){
            player.x = canvas.width - player.width;
        }

        else{
            player.move(1);
        }
    }
}

function moveEnemies(){
    for (let i = 0; i<enemy.length; i++){
        if(enemy[i].x<0){
            enemy.splice(i,1);
            i--;
        }

        else{
            enemy[i].move(-1);
        }
    }
}

function moveArrows(){
    for (let i = 0; i<playerArrows.length; i++){
        //console.log("arrow x,y: " + playerArrows[i].x + ", " + playerArrows[i].y);

        //if the arrow goes out of bounds, remove it from the array
        if(playerArrows[i].centerX > canvas.width || playerArrows[i].centerY > groundY){
            playerArrows.splice(i,1);
            i--;
            drawGround();
        }

        else{
            playerArrows[i].move(1);
        }
    }
}

function calculateAll(){
    if(charging){
        charge+=CHARGE_SPEED;
        if(charge > 100){
            charge = 100;
        }

        console.log("charging: " + charge);
    }

    else{
        charge=0;
    }

    if(timer%1000==0){
        enemy.push(new Component("#F0F",canvas.width, groundY-100,100,100,0.5));
    }

    if(timer == 10000){
        timer =0;
    }

    //check collisions of arrow vs enemy
    for (let j = 0; j<enemy.length; j++){
        for (let i = 0; i<playerArrows.length; i++){
            //if the arrow hits an enemy remove it from the array
            if(checkCollide(playerArrows[i],enemy[j])){
                enemy[j].color = getRandomColor();
                playerArrows.splice(i,1);
                i--;
            }
        }
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

function checkCollide(arrow, enemy){
    if((arrow.centerX < (enemy.x + enemy.width)) && (arrow.centerX > enemy.x) && 
        (arrow.centerY < (enemy.y+enemy.height)) && (arrow.centerY > enemy.y)){
        return true;
    }

    else{return false;}

   /* return !(
        ((Rect1.y+Rect1.height) < Rect2.y) ||
    (Rect1.y > (Rect2.y+Rect2.height)) ||
    (Rect1.x > (Rect2.x+Rect2.width)) ||
    ((Rect1.x+Rect1.width) < Rect2.x) )*/
}

function moveAll() {
    movePlayer();
    moveArrows();
    moveEnemies();
}

function drawAll(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    playerArrows.forEach(function(arrow){
        arrow.draw();
    }); 

    player.draw();

    enemy.forEach(function(e){
        e.draw();
    }); 

    drawGround();
    drawChargeBar();
   /*  for (var i = 0; i < enemy[j].length; i++) {
        enemy[i].draw();
    } */
}
/* gets the coordinates of the mouse relative to canvas origin */
function setCoord(e){
    mouseX = e.pageX - canvas.offsetLeft;
    mouseY = e.pageY - canvas.offsetTop;
    console.log("mouse: " + mouseX + ", " + mouseY);
}

function gameLoop() {
    if(!pause) {
        calculateAll();
        moveAll();
        drawAll();
        timer++;
    }

    else{
        context.clearRect(0, 0, canvas.width, groundY);
        context.font = "30px Arial";
        context.fillStyle = "#000";
        context.fillText("Game Paused", 100, 100);
    }
}
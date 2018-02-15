var pause=false;
var canvas, context;
var player;
const playerHeight = 60;
const groundHeight = 120;
const GRAVITY = 0.15;
var groundY;
var left, right;
var playerArrows = [];
var enemy;
var timer = 0;
var enemyHP;
var charge = 0;
var charging = false;
var CHARGE_SPEED = 2;
var mouseX, mouseY;

function setupGame() {
    canvas = document.getElementById("world");
    context = canvas.getContext("2d");
    const fps = 60;
    enemy = new Array(5);
    groundY = canvas.height - groundHeight;

    context.fillStyle = "#638e51";
  //  context.fillRect(0, groundY, canvas.width, groundHeight);

    player = new Component("#AAA",0,groundY-playerHeight,30,playerHeight,7);

    /* for (var i = 0; i < 5; i++){
        enemy[i]= new Component("#F0F",i*80+20,0,40,40);
        enemy[i].HP=enemyHP;
    } */

    setInterval(function() {gameLoop();}, 1000/fps);
}

/** graphical object that can be drawn and moved */

class Component  {
    constructor (color, x, y, width, height, speed){
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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
        //this.angle = angle;
        let sum = Math.abs(dx) + Math.abs(dy);
        this.xVel = speed * dx/sum/5;
        this.yVel = speed * dy/sum/5;

        console.log("velocity x,y " + this.xVel + ", " + this.yVel);
    }

    draw() {
        context.fillStyle = this.color;
        context.strokeRect(this.x, this.y, this.width, this.height);
    }

    get centerX(){
        return this.x + this.width/2;
    }

    get centerY(){
        return this.y + this.height/2;
    }

    set centerX(v){
        this.centerX = v;
        this.x = v - this.width/2;
    }

    move(direction){
        this.x+=this.xVel;
        this.y+=this.yVel;

        //apply gravity to y component
        this.yVel+=GRAVITY;
    }
}

function shootArrow(){
    let dx = mouseX - player.x;
    let dy = mouseY - player.y;

    console.log("arrow shot dx,dy: " + dx + ", " + dy);
    playerArrows.push(new Arrow("#F00",player.x,player.y,3,3,charge, dx, dy));
    
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

function moveArrows(){
    for (let i = 0; i<playerArrows.length; i++){
        playerArrows[i].move(1);
            console.log("arrow vx,y: " + playerArrows[i].xVel + ", " + playerArrows[i].yVel);
        if(playerArrows[i].x > canvas.width || playerArrows[i].y > groundY){
            playerArrows.splice(i, 1);
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

   /*  if(timer%100==0){
        var newRow = new Array(5);
        for (var i = 0; i<newRow.length; i++){
            newRow[i]= new Component("#F0F",i*80+20,0,40,40);
            newRow[i].HP=enemyHP;
        }

        enemy.push(newRow);
    }
 */

   /*  playerBullets.forEach(function(bullet){
        for (var i = 0; i < enemy.length; i++) {
            if (checkCollide(bullet, enemy[i])) {
                var bulletIndex = playerBullets.indexOf(bullet);
                if (bulletIndex > -1) {
                    playerBullets.splice(bulletIndex, 1);
                }
                enemy[i].HP-=10;

                if(enemy[i].HP<=0){
                    enemy.splice(i,1);
                }
            }
        }
    }); */
}

function checkCollide(Rect1, Rect2){
    return !(
        ((Rect1.y+Rect1.height) < Rect2.y) ||
    (Rect1.y > (Rect2.y+Rect2.height)) ||
    (Rect1.x > (Rect2.x+Rect2.width)) ||
    ((Rect1.x+Rect1.width) < Rect2.x) )
}

function moveAll() {
    movePlayer();
    moveArrows();
}

function drawAll(){
    context.clearRect(0, 0, canvas.width, groundY);

    playerArrows.forEach(function(arrow){
        arrow.draw();
    }); 

    //player.draw();

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
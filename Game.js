var pause=false;
var canvas, context;
var player;
var playerHeight = 60;
var groundHeight = 120;
var left, right;
var playerBullets = [];
var enemy;
var timer = 0;
var enemyHP;

function setupGame() {
    canvas = document.getElementById("world");
    context = canvas.getContext("2d");
    var fps = 60;
    enemy = new Array(5);
    groundY = canvas.height - groundHeight;

    context.fillStyle = "#638e51";
    context.fillRect(0, groundY, canvas.width, groundHeight);

    player = new Component("#AAA",0,groundY-playerHeight,30,playerHeight,7);
    enemyHP = 20;

    /* for (var i = 0; i < 5; i++){
        enemy[i]= new Component("#F0F",i*80+20,0,40,40);
        enemy[i].HP=enemyHP;
    } */

    setInterval(function() {gameLoop();}, 1000/fps);
}

function Component (color, x, y, width, height, speed) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

    this.draw = function() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        if(this.HP != null) {
            context.fillText(this.HP, this.x, this.y);
        }        
    };

    this.move = function(direction){
        this.x+=direction*this.speed;
    };
}

function moveAll() {

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
   /*  playerBullets.forEach(function (bullet) {
        if (bullet.y > 0) {
            bullet.move(0, -20);
        }

        else {
            var index = playerBullets.indexOf(bullet);
            if (index > -1) {
                playerBullets.splice(index, 1);
            }
        }
    });

    for (var i = 0; i < enemy.length; i++) {
        enemy[i].move(0, 1);
    } */
}

function calculateAll(){
   /*  if(timer%5==0) {
        playerBullets.push(new Component("#0FA", player.x + player.width / 2 - 5, player.y - 30, 10, 10));
        if(timer==200){
            timer=0;
        }
    } */

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

function drawAll(){
    context.clearRect(0, 0, canvas.width, groundY);

    /* playerBullets.forEach(function(bullet){
        bullet.draw();
    }); */

    player.draw();

   /*  for (var i = 0; i < enemy[j].length; i++) {
        enemy[i].draw();
    } */
}

function getCoord(e){
    var mouseX = e.pageX - canvas.offsetLeft;
    var mouseY = e.pageY - canvas.offsetTop;
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
var pause=false;
var canvas, context;
var player1, player2;
var left1, right1, left2, right2;
var playerBullets = [];
var enemy = [];
var timer = 0;
var enemyHP;

function setupGame() {
    canvas = document.getElementById("world");
    context = canvas.getContext("2d");
    var fps = 60;
    enemy[0] = new Array(5);
    player1 = new Component("#00A",100,680,30,30);
    player2 = new Component("#AAA",0,680,30,30);
    enemyHP = 20;

    for (var i = 0; i < 5; i++){
        enemy[0][i]= new Component("#F0F",i*80+20,0,40,40);
        enemy[0][i].HP=enemyHP;
    }

    setInterval(function() {gameLoop();}, 1000/fps);
}

function Component (color, x, y, width, height) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.draw = function() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        if(this.HP != null) {
            context.fillText(this.HP, this.x, this.y);
        }
    };

    this.move = function(xVelocity, yVelocity){
        this.x+=xVelocity;
        this.y+=yVelocity;
    };
}

function moveAll() {
    if (left1 && player1.x > 0) {
        player1.move(-7, 0);
    }

    if (right1 && player1.x < canvas.width - player1.width) {
        player1.move(7, 0);
    }

    if (left2 && player2.x > 0) {
        player2.move(-7, 0);
    }

    if (right2 && player2.x < canvas.width - player2.width) {
        player2.move(7, 0);
    }
    playerBullets.forEach(function (bullet) {
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

    for(var j=0; j<enemy.length; j++) {
        for (var i = 0; i < enemy[j].length; i++) {
            enemy[j][i].move(0, 1);
        }
    }
}

function calculateAll(){
    if(timer%5==0) {
        playerBullets.push(new Component("#000", player1.x + player1.width / 2 - 5, player1.y - 30, 10, 10));
        playerBullets.push(new Component("#0FA", player2.x + player2.width / 2 - 5, player2.y - 30, 10, 10));
        if(timer==200){
            timer=0;
        }
    }

    if(timer%100==0){
        var newRow = new Array(5);
        for (var i = 0; i<newRow.length; i++){
            newRow[i]= new Component("#F0F",i*80+20,0,40,40);
            newRow[i].HP=enemyHP;
        }

        enemy.push(newRow);
    }


    playerBullets.forEach(function(bullet){
        for (var j=0; j<enemy.length; j++){
            for (var i = 0; i < enemy[j].length; i++) {
                if (checkCollide(bullet, enemy[j][i])) {
                    var bulletIndex = playerBullets.indexOf(bullet);
                    if (bulletIndex > -1) {
                        playerBullets.splice(bulletIndex, 1);
                    }
                    enemy[j][i].HP-=10;

                    if(enemy[j][i].HP<=0){
                        enemy[j].splice(i,1);
                    }

                    if (enemy[j].length <1 ){
                        enemy.splice(j,1);
                    }
                }
            }
        }
    });
}

function checkCollide(Rect1, Rect2){
    return !(
        ((Rect1.y+Rect1.height) < Rect2.y) ||
    (Rect1.y > (Rect2.y+Rect2.height)) ||
    (Rect1.x > (Rect2.x+Rect2.width)) ||
    ((Rect1.x+Rect1.width) < Rect2.x) )
}

function drawAll(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    playerBullets.forEach(function(bullet){
        bullet.draw();
    });

    player1.draw();
    player2.draw();

    for(var j = 0; j < enemy.length; j++) {
        for (var i = 0; i < enemy[j].length; i++) {
            enemy[j][i].draw();
        }
    }
}

function gameLoop() {
    if(!pause) {
        calculateAll();
        moveAll();
        drawAll();
        timer++;
    }

    else{
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillText("Game Paused", 100, 100);
    }
}
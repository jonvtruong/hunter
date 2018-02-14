$(document).bind("keyup","esc",function () {
    if (!pause) {
        pause = true;
        context.fillText("Game Paused", 100, 100);
    }

    else {
        pause = false;
    }
});

$(document).bind("keyup","space",function () {
    //playerBullets.push(new Component("#000",player.x+player.width/2-15,player.y,30,30));
    enemy[[0,1]].color="#FFF";
    console.log(enemy[[0,1]].color);
});

$(document).bind("keydown","left",function () {
    left1 = true;
});

$(document).bind("keyup","left",function () {
    left1 = false;
});

$(document).bind("keydown","right",function () {
    right1 = true;
});

$(document).bind("keyup","right",function () {
    right1 = false;
});

$(document).bind("keydown","a",function () {
    left2 = true;
});

$(document).bind("keyup","a",function () {
    left2 = false;
});

$(document).bind("keydown","d",function () {
    right2 = true;
});

$(document).bind("keyup","d",function () {
    right2 = false;
});
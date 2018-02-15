$(document).ready( function() {
    $("#world").mousedown(function () {
        console.log("mouse down");
        charging = true;
        $("#world").on("mousemove", function(e){setCoord(e)});
    });

    $("#world").mouseup(function (e) {
        charging = false;
        $("#world").off("mousemove");
        setCoord(e);
        shootArrow();
    });

    $(document).bind("keyup","esc",function () {
        pause = !pause;
    });

    /*$(document).bind("keyup","space",function () {
        //playerBullets.push(new Component("#000",player.x+player.width/2-15,player.y,30,30));
        enemy[[0,1]].color="#FFF";
        console.log(enemy[[0,1]].color);
    });*/

    $(document).bind("keydown","a",function () {
        left = true;
    });

    $(document).bind("keyup","a",function () {
        left = false;
    });

    $(document).bind("keydown","d",function () {
        right = true;
    });

    $(document).bind("keyup","d",function () {
        right = false;
    });

});
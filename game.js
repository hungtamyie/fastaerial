var gameState = "none";
var canvas;
var ctx;

function startGame(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    tick();
};

var startTime = new Date().getTime();
var tickSound = new Audio('tick.mp3');
var blipSound = new Audio('blip.mp3');
var failSound = new Audio('fail.mp3');
var stickPos = [];
var jumpRelease = -1;
var releaseHeight = -1;
var secondJump = -1;
var dodgeDeadzone = 0.5;
var maxDifference = 10000;
var hasPlayedSound = false;
var jumpReleased = false;
var jumpButton = 0;
function tick(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    var gp = navigator.getGamepads()[0];
    if (gameState == "none") {
        if (!gp.buttons[jumpButton].pressed){
            jumpReleased = true;
        }
        if (gp.buttons[jumpButton].pressed && jumpReleased) {
            gameState = "midJump";
            stickPos = [];
            jumpRelease = -1;
            releaseHeight = -1;
            secondJump = -1;
            maxDifference = 10000;
            hasPlayedSound = false;
            dodgeDeadzone = document.getElementById("myRange").value/100;
            startTime = new Date().getTime();
            tickSound.volume = document.getElementById("sound").value/100;
            tickSound.play();
        }
    }
    if (gameState == "midJump") {
        var percentTime = (new Date().getTime() - startTime)/400;
        
        if (!hasPlayedSound) {
           if (Math.abs(0.6-percentTime) <= maxDifference) {
                maxDifference = 0.6-percentTime;
            }
            else {
                blipSound.volume = document.getElementById("sound").value/100;
                blipSound.currentTime = 0;
                blipSound.play();
                hasPlayedSound = true;
            }
        }
        
        if (jumpRelease == -1) {
            if (!gp.buttons[jumpButton].pressed) {
                jumpRelease = percentTime;
            }
            ctx.fillStyle="darkblue"
            ctx.fillRect(100,0,800 * percentTime,300);
        }
        else {
            ctx.fillStyle="darkblue"
            ctx.fillRect(100,0,800 * jumpRelease,300);
            if (secondJump == -1) {
                if (gp.buttons[jumpButton].pressed) {
                    tickSound.volume = document.getElementById("sound").value/100;
                    tickSound.play();
                    secondJump = percentTime
                    releaseHeight = gp.axes[1];
                    if (releaseHeight >= dodgeDeadzone) {
                        failSound.currentTime = 0;
                        failSound.volume = document.getElementById("sound").value/100;
                        failSound.play();
                    }
                }
            }
        }
        
        if (percentTime > 1) {
            gameState = "none";
            jumpReleased = false;
        }
        
        ctx.fillStyle = "white";
        ctx.fillRect(90 + 800 * percentTime,0,35,300);
        
        stickPos.push([percentTime, gp.axes[1]]);
    }
    
    if (gameState == "assignJump") {
        for(var i=0;i<gp.buttons.length;i++) {
            if(gp.buttons[i].pressed){
                jumpButton = i;
                gameState = "none";
                $('#rebindmsg').html('Jump key bound')
            }
        }
    }
    
    
    if (jumpRelease != -1) {
        ctx.fillStyle="darkblue"
        ctx.fillRect(100,0,800 * jumpRelease,300);
    }
    ctx.fillStyle = "grey";
    ctx.fillRect(0,30,900,2);
    ctx.fillRect(0,149,900,2);
    if (releaseHeight > dodgeDeadzone) {
        ctx.fillStyle="red";
    }
    for (var i = 0; i < 900; i+=20) {
        ctx.fillRect(i,149 + 120 * dodgeDeadzone,5,2);
    }
    ctx.fillStyle = "grey";
    ctx.fillRect(0,269,900,2);
    ctx.fillRect(100,30,2,240);
    ctx.fillStyle = "purple";
    if (secondJump != -1) {
        if (secondJump > 0.65 || secondJump < 0.55) {
            ctx.fillStyle="red";
        }
        else {
            ctx.fillStyle = "green";
        }
    }
    ctx.fillRect(580+35,30,5,240);
    ctx.fillRect(580-35,30,5,240);
    ctx.fillStyle="blue"
    ctx.fillRect(97 + 800 * secondJump,0,5,300);
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle ="white";
    if (stickPos[0]) {
        ctx.moveTo(100 + stickPos[0][0] * 800, stickPos[0][1] * 120 + 150);
    }
    for (i = 0; i < stickPos.length; i++) {
        ctx.lineTo(100 + stickPos[i][0] * 800, stickPos[i][1] * 120 + 150)
    }
    ctx.stroke();
    if (releaseHeight != -1) {
        ctx.fillStyle = "white";
        if (releaseHeight >= dodgeDeadzone) {
            ctx.fillStyle="red";
        }
        ctx.beginPath();
        ctx.arc(100 + 800 * secondJump, 150 + 120 * releaseHeight, 10, 0, 2 * Math.PI, false);
        ctx.fill();
    }
    
    window.requestAnimationFrame(tick);
}

function toggleTips() {
  var x = document.getElementById("tips");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
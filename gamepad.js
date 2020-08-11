var hasGP = false;
var repGP;

function canGame() {
    return "getGamepads" in navigator;
}

$(document).ready(function() {

    if(canGame()) {

        $(window).on("gamepadconnected", function() {
            hasGP = true;
            console.log("connection event");
            startGame();
        });

        $(window).on("gamepaddisconnected", function() {
            console.log("disconnection event");
        });

        //setup an interval for Chrome
        var checkGP = window.setInterval(function() {
            console.log('checkGP');
            if(navigator.getGamepads()[0]) {
                if(!hasGP) $(window).trigger("gamepadconnected");
            }
        }, 500);
    }

});
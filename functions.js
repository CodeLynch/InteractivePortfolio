var jva = document.getElementById("jva");
var logo = document.getElementById("logo");
var world = document.getElementById("world");
var currentKeys = [];
var moveSpeed = 3;
var up = 'w';
var left = 'a';
var down = 's';
var right = 'd';
var canMoveUp = true;
var canMoveLeft = true;
var canMoveDown = true;
var canMoveRight = true;
var isWarping = false;

var obstacles = document.querySelectorAll('.block');

function hideJVA(){
    jva.setAttribute('id', 'blank');
}

function inTopThirdOfScreenHeight(){ 
    var jvaPts = jva.getBoundingClientRect(); 
    var win = window.innerHeight; 
    return (win * .4 > jvaPts.top + jvaPts.height); 
}

function inLeftThirdOfScreenWidth(){ 
    var jvaPts = jva.getBoundingClientRect(); 
    var win = window.innerWidth; 
    return (win * .4 > jvaPts.left + jvaPts.width); 
}

function inBottomThirdOfScreenHeight(){ 
    var jvaPts = jva.getBoundingClientRect(); 
    var win = window.innerHeight; 
    return (win *.6 < jvaPts.top); 
}

function inRightThirdOfScreenWidth(){ 
    var jvaPts = jva.getBoundingClientRect(); 
    var win = window.innerWidth; 
    return (win *.6 < jvaPts.left); 
}

function isInView(x){ var bounds = x.getBoundingClientRect(); return(bounds.bottom > 0 && bounds.top < window.innerHeight); }

function isCollide(block1, block2){
    return !(
        block1.bottom < block2.top || 
        block1.top > block2.bottom || 
        block1.right < block2.left || 
        block1.left > block2.right 
    );
}

function checkWorldBound(){
    var jvaPoints  = jva.getBoundingClientRect();
    jvaPoints.bottom = jvaPoints.top + jvaPoints.height;
    jvaPoints.right = jvaPoints.left + jvaPoints.width;

    var worldPoints = world.getBoundingClientRect();
    worldPoints.bottom = worldPoints.top + worldPoints.height;
    worldPoints.right = worldPoints.left + worldPoints.width;
    if (jvaPoints.top <= worldPoints.top){
        canMoveUp = false;
    }
    if (jvaPoints.right >= worldPoints.right){
        canMoveRight = false;
    }if(jvaPoints.left <= worldPoints.left){
        canMoveLeft = false;
    }if(jvaPoints.bottom >= worldPoints.bottom){
        canMoveDown = false;
    };
}

function checkCollisions(){
    var enterDoor = false;
    var jvaPoints =  jva.getBoundingClientRect();
    jvaPoints.bottom = jvaPoints.top + jvaPoints.height;
    jvaPoints.right = jvaPoints.left + jvaPoints.width;
    
    var colliding = {};

    obstacles.forEach((obstacle)=>{
        var blockPoints = obstacle.getBoundingClientRect();
        blockPoints.bottom = blockPoints.top + blockPoints.height;
        blockPoints.right = blockPoints.left + blockPoints.width;
        
        var top = Math.abs(jvaPoints.bottom - blockPoints.top);
        var bottom = Math.abs(jvaPoints.top - blockPoints.bottom);
        var left = Math.abs(jvaPoints.right - blockPoints.left);
        var right = Math.abs(jvaPoints.left - blockPoints.right);
        
        if(isCollide(jvaPoints, blockPoints)){
            var shortestDist = Math.min(top, bottom, left, right);
            shortestDist == top? (colliding.top = true): 
            shortestDist == bottom? (colliding.bottom = true): 
            shortestDist == left? (colliding.left = true):
            (colliding.right = true);
        }

        if(obstacle.classList.contains("has-href") && isCollide(jvaPoints, blockPoints)){
            console.log(jvaPoints.bottom, blockPoints.top, " so jvaPoints.bottom < blockPoints.top+3:",jvaPoints.bottom < blockPoints.top+3 )
        }

        if(obstacle.classList.contains("door") &&  
        jvaPoints.top < blockPoints.bottom+5 ){
            enterDoor = true;
        }

        if(obstacle.classList.contains("has-href") && 
        jvaPoints.bottom < blockPoints.bottom+3 && 
        jvaPoints.top > blockPoints.top-8 &&
        jvaPoints.left > blockPoints.left-8 &&
        jvaPoints.right < blockPoints.right+8 &&
        !isWarping){
            isWarping = true;
            console.log("this has href;")
            obstacle.click();
        }
    })

    if(colliding.top){
        canMoveDown = false;
    }else{
        canMoveDown = true;
    }
    if(colliding.bottom){
        canMoveUp = false;
    }else{
        canMoveUp = true;
    } 
    if( colliding.left){
        canMoveRight = false;
    }else{
        canMoveRight = true;
    }
    if(colliding.right){
        canMoveLeft = false;
    }else{
        canMoveLeft = true;
    }
    if(enterDoor){
        canMoveUp = true;
        canMoveDown = true;
        canMoveLeft = true;
        canMoveRight = true;
    }

}

function gameLoop(){
    var leftPos = parseInt(jva.style.left);
    var topPos = parseInt(jva.style.top);
    if(currentKeys[left] && canMoveLeft){
        jva.style.left = leftPos - moveSpeed + "px";
        if(inLeftThirdOfScreenWidth()){
            window.scrollBy(-moveSpeed, 0);
        }
    }
    if(currentKeys[right] && canMoveRight ){
        jva.style.left = leftPos + moveSpeed + "px";
        if(inRightThirdOfScreenWidth()){
            window.scrollBy(moveSpeed, 0);
        }
    }
    if(currentKeys[up] && canMoveUp){
        jva.style.top = topPos - moveSpeed + "px";
        if(inTopThirdOfScreenHeight()){
            window.scrollBy(0,-moveSpeed);
        }
    }
    if(currentKeys[down] && canMoveDown){
        jva.style.top = topPos + moveSpeed + "px";
        if(inBottomThirdOfScreenHeight()){
            window.scrollBy(0,moveSpeed);
        }
    }

    checkCollisions();
    checkWorldBound();
    window.requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function(event){
    currentKeys[event.key] = true;
    jva.setAttribute("data-key-" + event.key, true);
})

document.addEventListener("keyup", function(event){
    currentKeys[event.key] = false;
    jva.setAttribute("data-key-" + event.key, false);
})

window.addEventListener("load",  function(){
    window.scroll(360, 510);
    gameLoop();
})


function closeDialogueBox(){
    let box = document.getElementById("dialogueBox")
    box.style.display = "none"
}

var msgArray = [
    "Thank you 2dWillNeverDie!",
    "Insert Coin to Play",
    "Press Start",
    "An Interactive Portfolio",
    "Programmer Extraordinaire!",
    "Hello World!",
    "Have you heard of Shibuya Kei?",
    "日本語のものはどれも美的です"
  ];
var randomNum = Math.floor(Math.random() * msgArray.length);
document.getElementById("subtextMsg").innerHTML = msgArray[randomNum];

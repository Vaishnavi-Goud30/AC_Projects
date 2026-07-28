let gameSeq = [];
let userSeq = [];

let started = false;
let level = 0;

let h5=document.querySelector("h5");

let btns=["red","yellow","green","blue"];

document.addEventListener("keypress",function(){
    if(started == false){
        console.log("game is started");
        started = true;

        levelUp();
    }
}); //by this only once game is started when any key is pressed

function btnFlash(btn){
    btn.classList.add("flash");
    setTimeout(function(){
        btn.classList.remove("flash");
    },200);
}

function levelUp(){
    userSeq = [];

    level++;
    h5.innerText = `Level ${level}`;

    let ranIdx=Math.floor(Math.random() * 3);
    let ranCol=btns[ranIdx];
    let randBtn=document.querySelector(`.${ranCol}`);
    // console.log(ranIdx);
    // console.log(ranCol);
    // console.log(randBtn);
    gameSeq.push(ranCol);
    console.log(gameSeq);
    btnFlash(randBtn);
}

function checkAns(idx){
    if(userSeq[idx] == gameSeq[idx]){
        if(userSeq.length == gameSeq.length){
            setTimeout(levelUp,1000);
        }
    } else{
        h5.innerHTML=`GameOver.! Your score is <b>${level}</b> <br> Press any key to start...`;
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function(){
            document.querySelector("body").style.backgroundColor = "white";
        },150);
        reset();
    }
}

function btnPress(){
    // console.log(this);
    let btn = this;
    btnFlash(btn);
    userColor = btn.getAttribute("id");
    console.log(userColor);
    userSeq.push(userColor);

    checkAns(userSeq.length-1);
}

let allBtns=document.querySelectorAll(".btn");
for(btn of allBtns){
    btn.addEventListener("click",btnPress);
}

function reset(){
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}
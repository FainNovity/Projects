
var turn = 'o';
var move= 0;
var allowed= true;
var won= "";
var selected = -1;
var valArr = [];
var winArr = [];
document.getElementById("turn").textContent = turn;
function select(n){
    if(allowed){
        allowed = false;
        selected = n;
        for(var i=0;i<9;i++){
            document.getElementsByClassName("ground")[1].getElementsByClassName("mini-box")[i].textContent = document.getElementsByClassName("box")[selected].getElementsByClassName("mini-box")[i].textContent;
        }
    }
    else{
        warn("you are not allowed to select box!");
    }

}
function warn(str){
    document.getElementById("warn").textContent = str;
    setTimeout(()=>{
        document.getElementById("warn").textContent = "";
    },3000);
}
function moveBox(n){
    if(selected==-1){
        warn("Select a box First!!");
    }
    else if(valArr[selected*9+n]==undefined || valArr[selected*9+n]==""){
       
        valArr[selected*9+n] = turn;
        document.getElementsByClassName("box")[selected].getElementsByClassName("mini-box")[n].textContent = turn;
        checkBox();
        allowed = true;
        if(winArr[n]=="" || winArr[n]==undefined)
        select(n);
        else {
            warn("you are allowed to choose a box.");
        }
    }
    else {
        warn("place is occupied. try other one.");
    }
}
function reset(){
    for(var i=0;i<9;i++){
        document.getElementsByClassName("box")[i].innerHTML= "<div class='mini-box'></div><div class='mini-box'></div><div class='mini-box'></div><div class='mini-box'></div><div class='mini-box'></div><div class='mini-box'></div><div class='mini-box'></div><div class='mini-box'></div><div class='mini-box'></div>";
        winArr[i] = "";
    }
}
function reset(n){
    for(var i=0;i<9;i++){
        document.getElementsByClassName("box")[selected].getElementsByClassName("mini-box")[i].textContent = "";
        valArr[selected*9+i]="";
    }
}
function checkBox(){
    
    for(var i=0;i<3;i++){
        if(valArr[selected*9+i*3] == valArr[selected*9 +i*3+1] && valArr[selected*9+i*3]==valArr[selected*9 +i*3+2] && !(valArr[selected*9+i*3]=="" || valArr[selected*9+i*3]==undefined)){
            winArr[selected] = valArr[selected*9+i*3];
            document.getElementsByClassName("box")[selected].innerHTML = valArr[selected*9+i*3];
            win();
            move++;
        if(move%2==0)
            turn='o';
        else 
        turn = 'x';
        document.getElementById("turn").textContent = turn;
            return;
        }
        if(valArr[selected*9+i] == valArr[selected*9 +i+3] && valArr[selected*9+i]==valArr[selected*9 +i+6] && !(valArr[selected*9+i]=="" || valArr[selected*9+i]==undefined)){
            winArr[selected]= valArr[selected*9+i];
            document.getElementsByClassName("box")[selected].innerHTML = valArr[selected*9+i];
            win();
            move++;
        if(move%2==0)
            turn='o';
        else 
        turn = 'x';
        document.getElementById("turn").textContent = turn;
            return;
        }
    }
    if((winArr[selected]=="" || winArr[selected]==undefined) && valArr[selected*9] == valArr[selected*9+4] && valArr[selected*9]==valArr[selected*9+8] && !(valArr[selected*9]=="" || valArr[selected*9]==undefined)){
        winArr[selected]= valArr[selected*9];
        document.getElementsByClassName("box")[selected].innerHTML = valArr[selected*9];
        win();
        move++;
        if(move%2==0)
            turn='o';
        else 
        turn = 'x';
        document.getElementById("turn").textContent = turn;
        return;
    }
    if((winArr[selected]=="" || winArr[selected]==undefined ) && valArr[selected*9+2] ==valArr[selected*9+4] && valArr[selected*9+2]==valArr[selected*9+6] && !(valArr[selected*9+2]=="" || valArr[selected*9+2]==undefined)){
        winArr[selected]= valArr[selected*9+2];
        document.getElementsByClassName("box")[selected].innerHTML = valArr[selected*9+2];
        win();
        move++;
        if(move%2==0)
            turn='o';
        else 
        turn = 'x';
        document.getElementById("turn").textContent = turn;
        return;
    }
    if(winArr[selected]!="" && winArr[selected]!=undefined){
            var filled = true;

            for(var i=0;i<9;i++){
                if(valArr[selected*9+i]=="" || valArr[selected*9+i]==undefined){
                    filled=false;
                    break;
                }
            }
            if(filled){
                reset(selected);
            }
        }
        move++;
        if(move%2==0)
            turn='o';
        else 
        turn = 'x';
        document.getElementById("turn").textContent = turn;
    }

function win(){
            for(var i=0;i<3;i++){
                if(winArr[i] == winArr[i+1] && winArr[i]==winArr[i+2] && !(winArr[i]=="" || winArr[i]==undefined)){
                    won = winArr[i];
                    document.getElementById("win").innerHTML = won;
                    document.getElementsByTagName("dialog")[0].open = true;
                    reset();
                    return;
                }
                if(winArr[i] ==winArr[i+3] && winArr[i]==winArr[i+6] && !(winArr[i]=="" || winArr[i]==undefined)){
                    won = winArr[i];
                    document.getElementById("win").innerHTML = won;
                    document.getElementsByTagName("dialog")[0].open = true;
                    reset();
                    return;
                }
            }
            if(winArr[0] == winArr[4] && winArr[0]==winArr[8] && !(winArr[0]=="" || winArr[0]==undefined)){
                won = winArr[0];
                document.getElementById("win").innerHTML = won;
                document.getElementsByTagName("dialog")[0].open = true;
                reset();
                
            }
            if(winArr[2] == winArr[4] && winArr[2]==winArr[6] && !(winArr[2]=="" || winArr[2]==undefined)){
                won = winArr[2];
                document.getElementById("win").innerHTML = won;
                document.getElementsByTagName("dialog")[0].open = true;
                reset();
                
            }
            if(won==""){
                var filled = true;
    
                for(var i=0;i<9;i++){
                    if(winArr[i]=="" || winArr[i]==undefined){
                        filled= false;
                        break;
                    }
                }
                if(filled){
                    document.getElementById("win").innerHTML = "None";
                    document.getElementsByTagName("dialog")[0].open = true;
                    reset();
                }
                    
                }
}
function rules(){
    document.querySelectorAll("dialog")[1].open = true;
}
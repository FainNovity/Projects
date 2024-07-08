
var arr = [[0,0]];
var applePos = [-1,-1];
var side;
var curr;
var lim = 95; // avail*0.8
var loop = 90;
var points = 0;
var speed = 200;
        
        for(var i=0;i<arr.length;i++){
            document.getElementById('ground').innerHTML+="<div class='snake'></div><div id='apple'></div>";
        }
        apple();
        update();

        addEventListener('keydown',(e)=>{
            speed = 200- 4*points;
            if(e.key=="ArrowUp"){
                document.getElementsByClassName("snake")[0].style.transform = "rotate(180deg)";
                clearInterval(curr);
                curr=setInterval(moveUp,speed);
            }
            else if(e.key=="ArrowRight"){
                document.getElementsByClassName("snake")[0].style.transform = "rotate(270deg)";
                clearInterval(curr);
                curr= setInterval(moveRight,speed);
            }
            else if(e.key=="ArrowDown"){
                document.getElementsByClassName("snake")[0].style.transform = "rotate(0deg)";
                clearInterval(curr);
                curr= setInterval(moveDown,speed);
            }
            else if(e.key=="ArrowLeft"){
                document.getElementsByClassName("snake")[0].style.transform = "rotate(90deg)";
                clearInterval(curr);
                curr= setInterval(moveLeft,speed);
            }
            
        });
        addEventListener('touchstart',(e)=>{
            
        });
        function moveRight(){
            if(arr.length==2){
                if(arr[0][1]+(100-loop)<=100 && arr[0][1]+(100-loop)==arr[1][1]){
                        gameOver();
                        return;
                    }
                    else if(arr[0][1]+(100-loop)>100 && arr[1][1]<15){
                        gameOver();
                        return;
                    }
            }
            for (let i = arr.length-1;i>0; i--) {
                arr[i][0] = arr[i-1][0];    
                arr[i][1] = arr[i-1][1];    
            }
            if(arr[0][1]+(100-loop)<=loop)
                arr[0][1] = arr[0][1]+(100-loop);
            else
                arr[0][1] = 0;
            update();
        }
        function moveLeft(){
            if(arr.length==2){
                if(arr[0][1]-(100-loop)>=0 && arr[0][1]-(100-loop)==arr[1][1]){
                        gameOver();
                        return;
                    }
                    else if(arr[0][1]-(100-loop)<0 && arr[1][1]>85){
                        gameOver();
                        return;
                    }
            }
            for (let i = arr.length-1;i>0; i--) {
                arr[i][0] = arr[i-1][0];    
                arr[i][1] = arr[i-1][1];    
            }
            if(arr[0][1]-(100-loop)>=0)
                arr[0][1] = arr[0][1]-(100-loop);
            else
                arr[0][1] = loop;
            update();
        }
        function moveUp(){
            if(arr.length==2){
                if(arr[0][0]-(100-loop)>=0 && arr[0][0]-(100-loop)==arr[1][0]){
                    gameOver();
                    return;
                }
                else if(arr[0][0]-(100-loop)<0 && arr[1][0]>85){
                    gameOver();
                    return;
                }
            }
            for (let i = arr.length-1;i>0; i--) {
                arr[i][0] = arr[i-1][0];    
                arr[i][1] = arr[i-1][1];    
            }
            if(arr[0][0]-(100-loop)>=0)
                arr[0][0] = arr[0][0]-(100-loop);
            else
                arr[0][0] = loop;
            update();
        }
        function moveDown(){
            if(arr.length==2){
                if(arr[0][0]+(100-loop)<=100 && arr[0][0]+(100-loop)==arr[1][0]){
                        gameOver();
                        return;
                    }
                    else if(arr[0][0]+(100-loop)>100 && arr[1][0]<15){
                        gameOver();
                        return;
                    }
            }
            for (let i = arr.length-1;i>0; i--) {
                arr[i][0] = arr[i-1][0];    
                arr[i][1] = arr[i-1][1];    
            }
            if(arr[0][0]+(100-loop)<=loop)
                arr[0][0] = arr[0][0]+(100-loop);
            else
                arr[0][0] = 0;
            update();
        }
       
        function touchScreen(func){
                speed = 200- 4*points;
               // document.getElementsByClassName("snake")[0].style.transform = "rotate(0deg)";
                clearInterval(curr);
                curr=setInterval(func,speed);
            
        }

        function eaten() {
           
            for(var i=1;i<arr.length;i++){
                //console.log(arr[0][0]+' '+arr[i][0]);
                if(arr[0][0]<arr[i][0]+(100-loop) && arr[0][0]+(100-loop)>arr[i][0] && arr[0][1]<arr[i][1]+(100-loop) && arr[0][1]+(100-loop)>arr[i][1]){
                    gameOver();
                    return;
                }
            }
                
            if(arr[0][0]<applePos[0]+(100-lim) && arr[0][0]+(100-loop)>applePos[0] && arr[0][1]<applePos[1]+(100-lim) && arr[0][1]+(100-loop)>applePos[1]){
                points++;
                document.getElementById("points").innerText = points;
                arr.push([arr[arr.length-1][0],arr[arr.length-1][1]]);
                document.getElementById('ground').innerHTML+="<div class='snake'></div>";
                apple();
            }
        }

        function update(){
            eaten();
            for (let i = 0; i < arr.length; i++) {
                document.getElementsByClassName('snake')[i].style.top = arr[i][0]+'%';
                document.getElementsByClassName('snake')[i].style.left = arr[i][1]+'%';
            }
        }
        function apple(){
            applePos = [Math.random()*lim,Math.random()*lim];
            document.getElementById('apple').style.top = applePos[0]+'%';
            document.getElementById('apple').style.left = applePos[1]+'%';
        }
        function gameOver(){
            clearInterval(curr);
            Swal.fire({
                title: "Game Over",
                text: "Points : "+points+(points>10?"! you did great, buddy!":". Better luck next time!"),
                icon: "error"
              });
              points= 0;
              speed = 200;
              document.getElementById("points").innerText = '0';
              document.getElementById('ground').innerHTML="<div class='snake'></div><div id='apple'></div>";
              apple();
            arr = [[0,0]];
            update();

        }
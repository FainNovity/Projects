const paths = document.location.pathname.split('/');
const server = paths[1];
const side = paths[2];
console.log(document.location);


var board = "";
var arr = [
    ['r','k','b','q','c','b','k','r'],
    ['p','p','p','p','p','p','p','p'],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    ['P','P','P','P','P','P','P','P'],
    ['R','K','B','Q','C','B','K','R']
];
var selected = [-1,-1]; // starting position
var enPass = [-1,-1];  // enPass cord
var castle = [[false,false],[false,false]]; // castling state
var turn = true;    // true means it's whtie's turn
var moved = false; // to check if move is done by any player.
var fakeEnemy = false; // to check for pawn 

for (let i = 0; i < arr.length; i++) { // initialize all functions and tile color.
        
    for (let j = 0; j < arr.length; j++) {
        if((i+j)%2!=0)
        document.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].style.background = "#ACEE1F";
        else 
            document.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].style.background = "#f9fbd6";

        document.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].setAttribute("onclick","validMove("+i+","+j+")"); // initialize function
    }
    
}

function display(){     // display new data on the screen
    for (let i = 0; i < arr.length; i++) {
        
        for (let j = 0; j < arr.length; j++) {
            if(arr[i][j]==' '){
            document.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].innerText = "\n"; // in table, just empty space is not counted so, need newline
        }
        else{
            if(arr[i][j].toLowerCase()=='p')
                document.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].innerText = "♟";
            else if(arr[i][j].toLowerCase()=='k')
                document.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].innerText = "♞";
            else if(arr[i][j].toLowerCase()=='b')
                document.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].innerText = "♝";
                else if(arr[i][j].toLowerCase()=='r')
                document.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].innerText = "♜";
                else if(arr[i][j].toLowerCase()=='q')
                    document.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].innerText = "♛";
                else if(arr[i][j].toLowerCase()=='c')
                    document.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].innerText = "♚";
                
                if(arr[i][j]<='Z')
                    document.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].style.color = 'white'; // changing color as per need
                else
                document.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].style.color = 'black'; // cause, otherwhise, pieces would look so bad...
        }
        
    }
    
}
    
}

async function getBoard(){
        let newBoard = board;
        let boardData = {};
        do {

                data = await fetch(document.location.origin+"/"+server, {
                    method: "GET"
                });
                boardData = await data.json();
                
                newBoard = boardData.board;

        } while(newBoard==board);
        console.log(boardData);
        document.getElementsByClassName("playerName")[1].innerText = boardData.white; 
        document.getElementsByClassName("playerName")[0].innerText = boardData.black; 
        board = newBoard;
        enPass = boardData.enPass;
        castle = boardData.castle;
        turn = boardData.turn;
        let ind =0;
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                if(board[ind]=='.')
                        arr[i][j] = " ";
                else{
                    arr[i][j] = board[ind];
                }
                ind++;
            }
        }
        if(boardData.won== 0){
            Swal.fire({
                title: "Draw by stalemate",
                width: 600,
                padding: "3em",
                color: "#716add",
                background: "#fff",
                backdrop: `
                  rgba(0,123,0,0.4)
                `
              });
              await fetch(document.location.origin+"/"+server,{
                method: "DELETE"
              });
        }
        if(boardData.won== 1){
            Swal.fire({
                title: "You lose!",
                width: 600,
                padding: "3em",
                color: "#716add",
                background: "#fff",
                backdrop: `
                  rgba(123,0,0,0.4)
                `
              });
              await fetch(document.location.origin+"/"+server,{
                method: "DELETE"
              });
        }
    display();
}
function getCurrBoard(){
    var str = "";
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            if(arr[i][j]==" ")
                str+=".";
            else
                str += arr[i][j];
        }
    }
    return str;
}

getBoard();
        display();  // initialize board values.
        if(side!=(turn?1:0)){
            getBoard();
        }

/**
 * now, comes all the move functions.
 * we are passing two arrays, pos-> containing current cordinates and next-> containing cordinates to move to.
 * Note : these functions will return boolean values only. main move is done after checking all possiblities.
 */

function pawnMove(pos,next){
    // check side of piece. we'll need it forward.
    var isBlack = true;
    if(arr[pos[0]][pos[1]]<='Z')  
        isBlack = false;
    
    if(!isBlack){   // if it's white, we gotta move upward in board but, indices will reduce. 
        if(pos[1]==next[1]){// is it on same line? then, it's either one or two move forward.
            
            if((next[0] - pos[0]) ==-1 && arr[next[0]][next[1]]==' ' ){ 
               // return check(white); <-- check function of white's king;
               if(!enPass.every((val,ind)=>val==-1))
                enPass = [-1,-1];   // make enpass available for it.
               return true;
            }
            if(pos[0]== 6 && (next[0] - pos[0]) ==-2 && arr[5][pos[1]]==" " && arr[next[0]][next[1]]==' ' ){
               // return check(white); <-- check function of white's king;
               enPass = next;
               return true;
            }
        }
        else {
            if(Math.abs(pos[1]-next[1])== 1 && next[0]==(pos[0]-1) && next[0]==2 && arr[next[0]][next[1]]==' ' && arr[pos[0]][next[1]]>='a' && arr[pos[0]][next[1]]!=' '){
                return true;
            }

            if(Math.abs(pos[1]-next[1])== 1 && next[0]==(pos[0]-1) && ((arr[next[0]][next[1]]>='a' && arr[next[0]][next[1]]!=' ') || fakeEnemy)){
                if(!enPass.every((val,ind)=>val==-1))
                    enPass = [-1,-1];
                return true;
            }
               // return check(white); <-- check function of white's king;

        }

    }
    else if(isBlack){
        if(pos[1]==next[1]){
            if(next[0] - pos[0] ==1 && arr[next[0]][next[1]]==' ' ){
                if(!enPass.every((val,ind)=>val==-1))
                    enPass = [-1,-1];
               
               return true;
            }
            if(pos[0]==1  && (next[0] - pos[0]) ==2 && arr[2][pos[1]]==" " && arr[next[0]][next[1]]==' '  ){
               
               enPass = next;
               return true;
            }
        }
        else {
            if(Math.abs(pos[1]-next[1])== 1 && next[0]==(pos[0]+1) && next[0]==5 && arr[next[0]][next[1]]==' ' && arr[pos[0]][next[1]]<='Z' && arr[pos[0]][next[1]]!=' '){
            return true;
        }
            if(Math.abs(pos[1]-next[1])== 1 && next[0]==(pos[0]+1) && ((arr[next[0]][next[1]]<='Z' && arr[next[0]][next[1]]!=' ') || fakeEnemy)){
                if(!enPass.every((val,ind)=>val==-1))
                    enPass = [-1,-1];
                return true;
            }
               
        }

    }

    return false;
}

function knightMove(pos,next){
    // checking side of piece
    var isBlack = true;
    if(arr[pos[0]][pos[1]]<='Z')
        isBlack = false;
    
    // check travel distance. should be any one from both set : [-1,1],[-2,2] 
    if((!isBlack && arr[next[0]][next[1]]>='A' && arr[next[0]][next[1]]<='Z') || (isBlack && arr[next[0]][next[1]]>='a' ))
        return false;
    else if(( Math.abs(pos[0]-next[0])==2 && Math.abs(pos[1]-next[1])==1 ) || ( Math.abs(pos[0]-next[0])==1 && Math.abs(pos[1]-next[1])==2 )){
        return true;
    }
    return false;
}

function bishopMove(pos,next){
    // check side of piece
    var isBlack = true;
    if(arr[pos[0]][pos[1]]<='Z')
        isBlack = false;

    // can't kill own pieces so, check for that. also, distance in x = distance in y for bishop so, follow that thing.
    if((!isBlack && arr[next[0]][next[1]]>='A' && arr[next[0]][next[1]]<='Z') || (isBlack && arr[next[0]][next[1]]>='a' ) || (Math.abs(pos[0]-next[0])!=Math.abs(pos[1]-next[1])))
        return false;
    // starting from start.
    var x = pos[0];
    var y = pos[1];

    // get closer to destination by 1 at a time
    for( i=x,j=y;i!=next[0] && j!= next[1];(i>next[0]?i--:i++),(j>next[1]?j--:j++)){
        // skip for 1st value.
        if(i==x && j==y)
            continue;
        // check if any piece comes in between or cordinates cross limits
        if(i>=8 || j>=8 || arr[i][j]!=' ')
            return false;
    }
    
    return true;
}
function rookMove(pos,next){
    // check for side of piece
    var isBlack = true;
    if(arr[pos[0]][pos[1]]<='Z')
        isBlack = false;

    //can't kill same side piece. also, any one axis should be same.
    if((!isBlack && arr[next[0]][next[1]]>='A' && arr[next[0]][next[1]]<='Z') || (isBlack && arr[next[0]][next[1]]>='a' ) || (Math.abs(pos[0]-next[0])!=0 && Math.abs(pos[1]-next[1]!=0)))
        return false;
    var x;
    var y;
    if(pos[0]==next[0]){
        x= pos[1];
        y = next[1];
    }
    else if(pos[1]==next[1]){
        x= pos[0];
        y = next[0];
    }
    else 
        return false;

        // get closer by one and check if any piece comes in between
    for(i=x ;i!= y;i>y?i--:i++){

        if(i==x)
            continue;
        if(pos[0]==next[0]){
            if(arr[next[0]][i]!=' ')
                return false;
        }
        else{
            if(arr[i][next[1]]!=' ')
                return false;
        }
    }
    // check for respective king's check.
    return true;
}

function queenMove(pos,next){
    
    //just call rookmove and bishopmove functions
    if(pos[0]==next[0] || pos[1]==next[1]){
        return rookMove(pos,next);
    }
    return bishopMove(pos,next);
}

function fakeMove(pos, next){ // makes a fake move to check if king is checked with it or not!
    var isBlack = true;
    var isEnpass = false;   // special case for enPassant

    // check sides
    if(arr[pos[0]][pos[1]]<='Z')
        isBlack = false;
    // enpassant case
    if((arr[pos[0]][pos[1]]== 'p' || arr[pos[0]][pos[1]]== 'P') && next[1]==enPass[1] && pos[0] == enPass[0]){
        isEnpass = true;
        arr[enPass[0]][enPass[1]] = " ";
    }
    // save piece that's on destination
    var nextPiece = arr[next[0]][next[1]];
    move(pos,next);     // make the move

    // find respective king and check for check
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            if(isBlack && arr[i][j]=='c'){
                // return result but, reset pieces before that
                if(!check([i,j],isBlack)){
                    arr[pos[0]][pos[1]] = arr[next[0]][next[1]];
                    arr[next[0]][next[1]] = nextPiece;
                    if(isEnpass)
                        arr[enPass[0]][enPass[1]]= (isBlack?'P':'p');
                    return true;        
                }
                arr[pos[0]][pos[1]] = arr[next[0]][next[1]];
                arr[next[0]][next[1]] = nextPiece;
                if(isEnpass)
                    arr[enPass[0]][enPass[1]]= (isBlack?'P':'p');
                return false;
            }
            if(!isBlack && arr[i][j]=='C'){
                        // return result but, reset pieces before that
                if(!check([i,j],isBlack)){
                    arr[pos[0]][pos[1]] = arr[next[0]][next[1]];
                    arr[next[0]][next[1]] = nextPiece;
                    if(isEnpass)
                        arr[enPass[0]][enPass[1]]= (isBlack?'P':'p');
                    return true;        
                }
                arr[pos[0]][pos[1]] = arr[next[0]][next[1]];
                arr[next[0]][next[1]] = nextPiece;
                if(isEnpass)
                    arr[enPass[0]][enPass[1]]= (isBlack?'P':'p');
                return false;
            }
        }
    }
}

/**
 * for stalemate,
 * we need to make sure that:
 * 1) king can't move - same as checkmate
 * 2) Other pieces can't move - brute force as checkmate
 * 3) King is not under check - will be be checked out side of function.
 * Logic for check mate :
 * we have function fake move that checks if move will give check on the king.
 * also, we have all move functions of all pieces.
 * we can either check all possible moves of all the pieces. Total 16*64 iterations.
 * OR
 * we can check all possible moves, piece-wise. Total moves = sum of all moves of all pieces (like, for queen, 56. for rook and bishop, 14. for knight, 8.for pawns 4-5. );
 * OR
 * we check with divide square method. First, check if king can move somewhere. If not, then, check for other moves. if check is given by knight or pawn, we gotta kill 'em cause, there's nothing that can come betwween them and king. Otherwise, we either kill the piece or try putting any other piece in between them. 
 */

function mate(){
    let kingInd = [-1,-1];
    // find king indices
    for(let i =0;i<arr.length;i++){
        for(let j=0;j<arr[0].length;j++){
            if(turn?arr[i][j]=='C':arr[i][j]=='c'){
                kingInd = [i,j];
                break;
            }
        }
        if(kingInd[0]!=-1)
            break;
    }
        // check for king's valid moves. if any exists, it's not a mate
    for(let i =kingInd[0]-1;i<=kingInd[0]+1;i++){
        for(let j=kingInd[1]-1;j<=kingInd[1]+1;j++){
            if(i>=0 && j>=0 && i<8 && j<8 && (i!=kingInd[0] || j!=kingInd[1]) && kingMove(kingInd,[i,j]) && fakeMove(kingInd,[i,j])){
                console.log("move to protect king to ",[i,j]);
                return false;
            }
        }
    }

    // brute force check for mate
    // find piece of respective side
    for(let i =0;i<arr.length;i++){
        for(let j=0;j<arr[0].length;j++){

            if(turn?(arr[i][j]<='Z' && arr[i][j]!=" "):arr[i][j]>='a'){
                // now, check for every possible square if there's any move available
                for(let k =0;k<arr.length;k++){
                    for(let l=0;l<arr[0].length;l++){

                        // if else ladder for all pieces 

                       if((turn?arr[i][j]=='P':arr[i][j]=='p') && pawnMove([i,j],[k,l])){
                        if(fakeMove([i,j],[k,l])){
                            console.log("move to protect king ",[i,j]," ",[k,l]);
                               return false;
                            }
                       }
                       if((turn?arr[i][j]=='K':arr[i][j]=='k') && knightMove([i,j],[k,l])){
                        if(fakeMove([i,j],[k,l])){
                            console.log("move to protect king ",[i,j]," ",[k,l]);
                               return false;
                            }
                       }
                       if((turn?arr[i][j]=='B':arr[i][j]=='b') && bishopMove([i,j],[k,l])){
                        if(fakeMove([i,j],[k,l])){
                            console.log("move to protect king ",[i,j]," ",[k,l]);
                               return false;
                            }
                       }
                       if((turn?arr[i][j]=='R':arr[i][j]=='r') && rookMove([i,j],[k,l])){
                        if(fakeMove([i,j],[k,l])){
                            console.log("move to protect king ",[i,j]," ",[k,l]);
                               return false;
                            }
                       }
                       if((turn?arr[i][j]=='Q':arr[i][j]=='q') && queenMove([i,j],[k,l])){
                        if(fakeMove([i,j],[k,l])){
                            console.log("move to protect king ",[i,j]," ",[k,l]);
                               return false;
                            }
                       }
                    }
                }

            }
        }
    }
    // if there's no move available, it's mate. with check, checkmate else stalemate
    return true;
}



function check(pos,isBlack){
    fakeEnemy = true;

    for (let i = 0; i < arr.length; i++) {
       for (let j = 0; j < arr.length; j++) {
        if(!isBlack && arr[i][j]>='a'){
            
            //console.log(arr[i][j]+" ");
            if(arr[i][j]=='p' && j!=pos[1] && pawnMove([i,j],pos)){
                fakeEnemy = false;
                return true;
            }
            else if(arr[i][j]=='k' && knightMove([i,j],pos)){
                fakeEnemy = false;
                return true;
            }
            else if(arr[i][j]=='r' && rookMove([i,j],pos)){
                fakeEnemy = false;
                return true;
            }
            else if(arr[i][j]=='b' && bishopMove([i,j],pos)){
                fakeEnemy = false;
                return true;
            }
            else if(arr[i][j]=='q' && queenMove([i,j],pos)){
                fakeEnemy = false;
                return true;
            }
            else if(arr[i][j]=='c' && (Math.abs(pos[0]-i)<= 1 && Math.abs(pos[1]-j)<= 1)){
                fakeEnemy = false;
                return true;
            }
        }
        else if(isBlack && arr[i][j]<='Z') {
            
            if(arr[i][j]=='P' && j!=pos[1] && pawnMove([i,j],pos)){
                fakeEnemy = false;
                return true;
            }
            else if(arr[i][j]=='K' && knightMove([i,j],pos)){
                fakeEnemy = false;
                return true;
            }
            else if(arr[i][j]=='R' && rookMove([i,j],pos)){
                fakeEnemy = false;
                return true;
            }
            else if(arr[i][j]=='B' && bishopMove([i,j],pos)){
                fakeEnemy = false;
                return true;
            }
            else if(arr[i][j]=='Q' && queenMove([i,j],pos)){
                fakeEnemy = false;
                return true;
            }
            else if(arr[i][j]=='C' && (Math.abs(pos[0]-i)<= 1 && Math.abs(pos[1]-j)<= 1)){
                fakeEnemy = false;
                return true;
            }
        }

       }     
    }
    fakeEnemy = false;
    return false;
}

function kingMove(pos,next){
    var isBlack = true;
    if(arr[pos[0]][pos[1]]<='Z')
        isBlack = false;
    if((Math.abs(pos[0]-next[0])==1 || Math.abs(pos[1]-next[1])==1) && !check(next,isBlack)){
        if(arr[next[0]][next[1]]==' ' || (turn && arr[next[0]][next[1]]>='a') || (!turn && arr[next[0]][next[1]]<='Z'))
            return true;
    }
    if(isBlack){
        if((pos[1]-next[1] == 2 && !castle[1][0] && arr[pos[0]][pos[1]-1]== " " && arr[pos[0]][pos[1]-2]== " " && arr[pos[0]][pos[1]-3]== " " && !check([pos[0],pos[1]-1],isBlack) && !check([pos[0],pos[1]-2],isBlack)) || (pos[1]-next[1] == -2 && !castle[1][1] && arr[pos[0]][pos[1]+1]== " " && arr[pos[0]][pos[1]+2]== " " && !check([pos[0],pos[1]+1],isBlack) && !check([pos[0],pos[1]+2],isBlack) )){
            return true;
        }
    }
    if(!isBlack){
        if((pos[1]-next[1] == 2 && !castle[0][0] && arr[pos[0]][pos[1]-1]== " " && arr[pos[0]][pos[1]-2]== " " && arr[pos[0]][pos[1]-3]== " " && !check([pos[0],pos[1]-1],isBlack) && !check([pos[0],pos[1]-2],isBlack)) || (pos[1]-next[1] == -2 && !castle[0][1] && arr[pos[0]][pos[1]+1]== " " && arr[pos[0]][pos[1]+2]== " " && !check([pos[0],pos[1]+1],isBlack) && !check([pos[0],pos[1]+2],isBlack))){
            return true;
        }
    }
    console.log("King didn't move");
    console.log(castle);
    console.log(check([pos[0],pos[1]-1],isBlack), " ",check([pos[0],pos[1]-2],isBlack));
    return false;
}

function move(pos, next){
    var isBlack = true;
    if(arr[pos[0]][pos[1]]<='Z')
        isBlack = false;
    if(isBlack && arr[next[0]][next[1]]<='Z')
        arr[next[0]][next[1]]= " ";
    if(!isBlack && arr[next[0]][next[1]]>='a')
        arr[next[0]][next[1]]= " ";
    var ch = arr[next[0]][next[1]];
    arr[next[0]][next[1]] = arr[pos[0]][pos[1]];
    arr[pos[0]][pos[1]] = ch;
}

async function validMove(i,j){
   if((side==1 && turn) || (side==0 && !turn)){

       if(selected[0]==-1){
           selected= [i,j];
           console.log(document.getElementsByTagName('tr')[i].getElementsByTagName('td')[j].style.background);
           document.getElementsByTagName('tr')[i].getElementsByTagName('td')[j].style.background+= " radial-gradient(#f7f7f7,#0ac9ef 40%,transparent 70%)";
           return;
        }
        //console.log(selected +" move to "+[i,j]);
        if(((arr[selected[0]][selected[1]]=='p' && !turn) || (arr[selected[0]][selected[1]]=='P' && turn)) && pawnMove(selected,[i,j]) && fakeMove(selected,[i,j])){
            
            move(selected,[i,j]);
            if(arr[i][j]=='p' && i==7){
                let newPiece = await Swal.fire({
                    title: "Pawn Promotion",
                    input: "radio",
                    inputOptions: {
                        "q": "♛",
                        "r" : "♜",
                        "k" : "♞",
                        "b" : "♝"
                    }
                  });
                  if(newPiece.value == null)
                    newPiece.value = "q"; 
                arr[i][j] = newPiece.value;
            }
            else if(arr[i][j]=='P' && i==0){
                let newPiece = await Swal.fire({
                    title: "Pawn Promotion",
                    input: "radio",
                    inputOptions: {
                        "Q": "♛",
                        "R" : "♜",
                        "K" : "♞",
                        "B" : "♝"
                    }
                });
                if(newPiece.value == null)
                  newPiece.value = "Q"; 
                  arr[i][j] = newPiece.value;
            }
        if(enPass[0] == selected[0] && enPass[1] == j){
            arr[enPass[0]][enPass[1]] = ' ';
            enPass = [-1,-1];
        }
        turn = !turn;
        display();
        
        
    }
    else if(((arr[selected[0]][selected[1]]=='k' && !turn) || (arr[selected[0]][selected[1]]=='K' && turn)) && knightMove(selected,[i,j]) && fakeMove(selected,[i,j]) ){
        move(selected,[i,j]);
        if(!enPass.every((val,ind)=>val==-1))
            enPass = [-1,-1];
        turn = !turn;
        display();
        
        
    }
    else if(((arr[selected[0]][selected[1]]=='b' && !turn) || (arr[selected[0]][selected[1]]=='B' && turn)) && bishopMove(selected,[i,j]) && fakeMove(selected,[i,j]) ){
        move(selected,[i,j]);
        if(!enPass.every((val,ind)=>val==-1))
            enPass = [-1,-1];
        turn = !turn;
        display();
        
        
    }
    else if(((arr[selected[0]][selected[1]]=='r' && !turn) || (arr[selected[0]][selected[1]]=='R' && turn)) && rookMove(selected,[i,j]) && fakeMove(selected,[i,j]) ){
        if(arr[selected[0]][selected[1]]=='r'){
            if(selected[0] == selected[1] && selected[0]==0)
                castle[1][0] = true;
            if(selected[1] == 7 && selected[0]==0)
                castle[1][1] = true;
        }
        else {
            if(selected[0] == selected[1] && selected[0]==7)
                castle[0][1] = true;
            if(selected[1] == 0 && selected[0]==7)
                castle[1][0] = true;
        }
        move(selected,[i,j]);
        if(!enPass.every((val,ind)=>val==-1))
            enPass = [-1,-1];
        turn = !turn;
        display();
        
        
    }
    else if(((arr[selected[0]][selected[1]]=='q' && !turn) || (arr[selected[0]][selected[1]]=='Q' && turn)) && queenMove(selected,[i,j]) && fakeMove(selected,[i,j]) ){
        move(selected,[i,j]);
        if(!enPass.every((val,ind)=>val==-1))
            enPass = [-1,-1];
        turn = !turn;
        display();
        
        
    }
    else if(((arr[selected[0]][selected[1]]=='c' && !turn) || (arr[selected[0]][selected[1]]=='C' && turn)) && kingMove(selected,[i,j]) && fakeMove(selected,[i,j]) ){
        if(arr[selected[0]][selected[1]]=='c'){
            if(selected[1]-j == 2 && j == 2 && i == 0)
                move([0,0],[0,3]);
            else if(selected[1]-j == -2 && j == 6 && i == 0)
                move([0,7],[0,5]);
            
            castle[1][0] = true;
            castle[1][1] = true;
        }
        else {
            if(selected[1]-j == 2 && j == 2 && i == 7)
                move([7,0],[7,3]);
            else if(selected[1]-j == -2 && j == 6 && i == 7)
                move([7,7],[7,5]);
            castle[0][0] = true;
            castle[0][1] = true;
        }
        move(selected,[i,j]);
        if(!enPass.every((val,ind)=>val==-1))
            enPass = [-1,-1];
        turn = !turn;
        display();
        
        
    }
    if((selected[0]+selected[1])%2!=0)
        document.getElementsByTagName('tr')[selected[0]].getElementsByTagName('td')[selected[1]].style.background= "#ACEE1F";
    else
    document.getElementsByTagName('tr')[selected[0]].getElementsByTagName('td')[selected[1]].style.background= "#f9fbd6";
    let isMate = -1;// 1 for checkmate. 0 for stalemate
for(let i =0;i<arr.length;i++){
    for(let j=0;j<arr[0].length;j++){
        if((turn?arr[i][j]=='C':arr[i][j]=='c') && check([i,j],!turn) && mate()){
            Swal.fire({
                title: "You win!",
                width: 600,
                padding: "3em",
                color: "#716add",
                background: "#fff",
                backdrop: `
                  rgba(0,123,0,0.4)
                `
              });
            isMate = 1;
        }
        else if((turn?arr[i][j]=='C':arr[i][j]=='c') && mate()){
            Swal.fire({
                title: "Draw by stalemate!",
                width: 600,
                padding: "3em",
                color: "#716add",
                background: "#fff",
                backdrop: `
                  rgba(123,0,0,0.4)
                `
              });
            isMate = 0;
        }
    }
}
if(side!=(turn?1:0)){
    board = getCurrBoard();
        await fetch(document.location.origin+"/"+server,{
            method:"POST",
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: new URLSearchParams({"board" :board,"enPass": [...enPass], "castle" : castle,"turn": turn,"won":(isMate>-1?isMate:-1)})
        });
    getBoard();
}


moved = true;
selected = [-1,-1];
}
}





/**
 * Idea for multiple device play:
 * use server to comunicate between devices.
 * arr of obj as data object to store move sequence / use database system
 * need to keep count of requests from server to define white and black
 * close sever when both players are offline.
 * 
 * problems:
 * don't know how to differentiate white player's request from black player.
 * don't know how to store and manipulate data.
 * too lazy too code all the stuff until that spark strikes
 * don't know anything of database management at projection level
 * don't know how to check if user is still playing on server or not (so that we can free the server)
 * need support with dbms and all the logic stuff
 * explanation issues
 * need to know when to stop 
 */
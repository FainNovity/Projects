var card = [
    {
        name: 'Striker', // character name
        img: 'Striker.png', // img url
        attack: [150,90,50], // attack value
        waiting: [50,30,10], // time to wait before use
        energy: [-4,-2,2],  // energy reequired to perform move
        taken: [15,10,5]  // time taken to attack
    },
    {
        name: 'Admiral',
        img: 'Admiral.png',
        attack: [140,100,50],
        waiting: [48,25,10],
        energy: [-4,-2,2], 
        taken: [14,10,4] 
    },
    {
        name: 'Thruster',
        img: 'Thruster.png',
        attack: [150,95,45],
        waiting: [50,30,10],
        energy: [-4,-2,2], 
        taken: [15,11,4] 
    },
    {
        name: 'Healer witch',
        img: 'Healer%20witch.png',
        attack: [100,80,50,-180],
        waiting: [40,30,10,80],
        energy: [-4,-2,2,-5], 
        taken: [15,10,4,5] 
    },
    {
        name: 'Semi-admiral',
        img: 'Semi-admiral.png',
        attack: [130,90,60],
        waiting: [45,28,10],
        energy: [-4,-2,2], 
        taken: [13,8,5] 
    },
    {
        name: 'Supreme fighter',
        img: 'supreme%20fighter.png',
        attack: [160,110,70],
        waiting: [55,30,8],
        energy: [-4,-2,2], 
        taken: [13,10,4] 
    },
    {
        name: 'Healer',
        img: 'healer.png',
        attack: [110,80,60,-200],
        waiting: [45,30,12,90],
        energy: [-4,-2,2,-5], 
        taken: [18,10,5,8] 
    },
    {
        name: 'Wolfred',
        img: 'Wolfred.png',
        attack: [140,105,60],
        waiting: [50,30,10],
        energy: [-4,-2,2], 
        taken: [18,10,4] 
    }
];
var TU = 0; // current time unit
var turn = true; // is it turn of mitra rajya?
var maxHealth = 1500;  // managing max health of both
var health = [maxHealth,maxHealth]; // heath of both the sides
var taken = []; //Cards distribution management
var energy = [10,10];  // energy management 
var queue = []; // waiting moves list.


// Making Read info
for(let i=0;i<card.length;i++){
    document.querySelector("dialog").innerHTML+="<div class='data'> <div class='pic' style='background-image:url("+card[i].img+");'></div> <div class='info'> <label>NAME : </label> <span>"+card[i].name+"</span>  </div> </div>";
    
    // Write about attack
    for (let j = 0; j < card[i].attack.length; j++) {
        document.getElementsByClassName('info')[i].innerHTML+= "<label>Attack - waiting time - time taken : </label> <span>"+card[i].attack[j]+" - "+card[i].waiting[j]+" - "+ card[i].taken[j] +"</span>";
    }
}

// Assigning characters to card
for(let i=0;i<8;i++){
    let num = -1;

    // find one player that is not used
    do {
        num = parseInt(Math.random()*8);
    }while(taken.includes(num));
    taken.push(num);
    //document.getElementsByClassName('card')[i].style.background = "";
    document.getElementsByClassName('card')[i].style.backgroundImage = "url('"+card[num].img+"')";
    document.getElementsByClassName('card')[i].setAttribute('title',card[num].name);
    document.getElementsByClassName('card')[i].innerHTML += "<div class='bar'> </div>";
    card[num].id = i;

    // assign moves of player
    for (let j = 0; j < card[num].attack.length; j++) {
        document.getElementsByClassName('card')[i].getElementsByClassName('bar')[0].innerHTML += "<div class='pow' style='background-image: url(sword.png); background-color: "+((j==0)?"red":(j==1)?"orange":(j==2)?"yellow":"green")+";' waiting='0' title='atk :"+card[num].attack[j]+", waiting : "+card[num].waiting[j]+", taken : "+ card[num].taken[j] +"' onclick='atk("+card[num].attack[j]+","+num+","+(i>=4?1:0)+")'></div>";
        
    }
    
}
// asign health to players
document.getElementsByClassName('health')[0].innerText = health[0];
document.getElementsByClassName('health')[1].innerText = health[1];

// assign energy to players
document.getElementsByClassName('energy')[0].innerText = energy[0];
document.getElementsByClassName('energy')[1].innerText = energy[1];
//initialize time unit with 0.
document.getElementsByClassName('TU')[0].innerText = TU;


function atk(val,num,player){

    // check turn of player
    if(turn!=(player%2==0)){
       warn("Not your turn!");
        return;
    }
    //find whose enemy
    enemy = 1;
    if(enemy==player)
        enemy--;

        // if move is waitng
        var found = false;
        for(obj of queue){
            if(card[obj.id].name == card[num].name && val==card[num].attack[obj.atk]){
                found = true;
                break;
            }
        }
        if(found){
            
            warn("move is in waiting!");
            return;
        }

        // if energy is not sufficient
        if(energy[player] + card[num].energy[card[num].attack.indexOf(val)]<0){
            
            warn("Not sufficient energy!");
            return;
        }

        // change energy level
        energy[player] += card[num].energy[card[num].attack.indexOf(val)];
        energy[player] = Math.min(energy[player],10);
    if(val>0){
        //if enemy is attacked
        health[enemy]-=val;
        if(health[enemy]<=0)   
            health[enemy]=0;
        document.getElementsByClassName('health')[enemy].innerText = health[enemy];
        document.getElementsByClassName('health')[enemy].style.animationPlayState = 'running';
        
        setTimeout(()=>{
            document.getElementsByClassName('health')[enemy].style.animationPlayState = 'paused';
        },980);
        document.getElementsByClassName('side')[enemy].style.transform = 'translate(-50%,-50%) rotate(15deg)';
        setTimeout(()=>{
            document.getElementsByClassName('side')[enemy].style.transform = 'translate(-50%,-50%) rotate(-15deg)';
        },100);
        setTimeout(()=>{
            document.getElementsByClassName('side')[enemy].style.transform = 'translate(-50%,-50%) rotate(15deg)';
        },400);
        setTimeout(()=>{
            document.getElementsByClassName('side')[enemy].style.transform = 'translate(-50%,-50%) rotate(-15deg)';
        },700);
        setTimeout(()=>{
            document.getElementsByClassName('side')[enemy].style.transform = 'translate(-50%,-50%) rotate(15deg)';
        },900);
        setTimeout(()=>{
            document.getElementsByClassName('side')[enemy].style.transform = 'translate(-50%,-50%)';
        },900);
    }
    else {
        // if player is healing
        health[player]-= val;
        health[player]= Math.min(health[player],maxHealth); // can't cross maxHealth
        document.getElementsByClassName('health')[player].innerText = health[player];
    }

    // Update time units
    TU+= card[num].taken[card[num].attack.indexOf(val)];
    document.getElementsByClassName('TU')[0].innerText = TU;
    // update energy and set waitng states. push move in waiting
    document.getElementsByClassName('energy')[player].innerText = energy[player];
    //document.getElementsByClassName('card')[card[num].id].getElementsByClassName('pow')[card[num].attack.indexOf(val)].setAttribute('waiting',card[num].waiting[card[num].attack.indexOf(val)]);
    queue.push({
        id: num,
        atk: card[num].attack.indexOf(val),
        waiting : card[num].waiting[card[num].attack.indexOf(val)]
    });
    // update others' waitng state.
    //var atkBox = document.getElementsByClassName('pow');
    for(var i=0; i<queue.length-1;i++){
        // if(atkBox[i]!=document.getElementsByClassName('card')[card[num].id].getElementsByClassName('pow')[card[num].attack.indexOf(val)]){
        // var toWait = document.getElementsByClassName('pow')[i].getAttribute('waiting');
        // document.getElementsByClassName('pow')[i].setAttribute('waiting', parseInt(toWait)- card[num].taken[card[num].attack.indexOf(val)]);
        // if(document.getElementsByClassName('pow')[i].getAttribute('waiting')<0){
            
        // }
        // }
        queue[i].waiting -= card[num].taken[card[num].attack.indexOf(val)];
        if(queue[i].waiting<=0){
            queue.splice(i,1);
            i--;
        }
        
    }

    queue.sort((a,b)=>a.waiting-b.waiting);
        
    document.getElementsByClassName("waitingMoves")[0].innerHTML = "";
    for(i in queue){
            let atkNum = queue[i].atk;
            console.log(atkNum +" "+ ((atkNum==0)?'red':(atkNum==1)?'orange':(atkNum==2)?'yellow':'green'));
            document.getElementsByClassName("waitingMoves")[0].innerHTML += "<div class='waiting' style='background-image: url("+card[queue[i].id].img+"); --data-atk: "+((atkNum==0)?'red':(atkNum==1)?'orange':(atkNum==2)?'yellow':'green')+"' title='"+queue[i].waiting+"'></div>";
            if(i==queue.length-1){
                document.getElementsByClassName("waiting")[i].style.animation = "show 1s forwards";
            }
    }
    // gotta change the turn
    turn=!turn;
    // check if any side won or not.
    win();
    
}

function win(){
    // check if health reached 0;
    var winner;
    if(health[0]<=0)
        winner = 1;
    else if(health[1]<=0)
        winner = 0;
    else
        return;
    maxHealth += 500; // increase maxHealth by 500
    health = [maxHealth,maxHealth]; // initialize again
    energy = [10,10]; // initialize again
    TU = 0; // initialize again
    // update health states
    document.getElementsByClassName('health')[0].innerText = health[0];
    document.getElementsByClassName('health')[1].innerText = health[1];
    document.getElementsByClassName('energy')[0].innerText = energy[0];
    document.getElementsByClassName('energy')[1].innerText = energy[1];
    document.getElementsByClassName('TU')[0].innerText = TU;
    //reseting variables and waitng states
    turn = true;
    var atkBox = document.getElementsByClassName('pow');
    for(var i=0; i<atkBox.length;i++){       
        document.getElementsByClassName('pow')[i].setAttribute('waiting', 0);
        }
      
        // declare the winner
    document.getElementById('win').innerText = (winner==0?"Heroic Hawks":" Fearless Falcons");
    document.getElementsByClassName('winner')[0].style.visibility = 'visible';
    document.getElementsByClassName('winner')[0].style.height = '50vh';
}

function warn(str){
    // warn things!
    document.getElementById('warn').innerText = str;
       setTimeout(()=>{
        document.getElementById('warn').innerText = "";
    },3000);
}

function rules(){
    document.querySelector('dialog').open = true;
}

function closeWinner(){
    document.getElementsByClassName('winner')[0].style.visibility = "collapse";
}
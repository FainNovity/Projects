var card = [
    {
        name: 'arjun', // character name
        img: 'arjun.jpg', // img url
        attack: [150,90,50], // attack value
        waiting: [50,30,10], // time to wait before use
        taken: [15,10,5]  // time taken to attack
    },
    {
        name: 'dron',
        img: 'dron.jpg',
        attack: [140,100,50],
        waiting: [48,25,10],
        taken: [14,10,4] 
    },
    {
        name: 'karn',
        img: 'karn.jpg',
        attack: [150,95,45],
        waiting: [50,30,10],
        taken: [15,11,4] 
    },
    {
        name: 'draupadi',
        img: 'draupadi.jpg',
        attack: [100,80,50,-180],
        waiting: [40,30,10,80],
        taken: [15,10,4,5] 
    },
    {
        name: 'yudhisthir',
        img: 'yudhisthir.jpg',
        attack: [130,90,60],
        waiting: [45,28,10],
        taken: [13,8,5] 
    },
    {
        name: 'bhism',
        img: 'bhism.jpeg',
        attack: [160,110,70],
        waiting: [55,30,8],
        taken: [13,10,4] 
    },
    {
        name: 'vidur',
        img: 'vidur.jpg',
        attack: [110,80,60,-200],
        waiting: [45,30,12,90],
        taken: [18,10,5,8] 
    },
    {
        name: 'abhimanyu',
        img: 'abhimanyu.jpg',
        attack: [140,105,60],
        waiting: [50,30,10],
        taken: [18,10,4] 
    }
];
var turn = true;
var maxHealth = 1500;
var health = [maxHealth,maxHealth]; // heath of both the sides
var taken = [];

for(let i=0;i<card.length;i++){
    document.querySelector("dialog").innerHTML+="<div class='data'> <div class='pic' style='background-image:url("+card[i].img+");'></div> <div class='info'> <label>NAME : </label> <span>"+card[i].name+"</span>  </div> </div>";
    
    for (let j = 0; j < card[i].attack.length; j++) {
        document.getElementsByClassName('info')[i].innerHTML+= "<label>Attack - waiting time - time taken : </label> <span>"+card[i].attack[j]+" - "+card[i].waiting[j]+" - "+ card[i].taken[j] +"</span>";
    }
}

for(let i=0;i<8;i++){
    let num = -1;
    do {
        num = parseInt(Math.random()*8);
    }while(taken.includes(num));
    taken.push(num);
    //document.getElementsByClassName('card')[i].style.background = "";
    document.getElementsByClassName('card')[i].style.backgroundImage = "url('"+card[num].img+"')";
    document.getElementsByClassName('card')[i].setAttribute('title',card[num].name);
    document.getElementsByClassName('card')[i].innerHTML += "<div class='bar'> </div>";
    card[num].id = i;
    for (let j = 0; j < card[num].attack.length; j++) {
        document.getElementsByClassName('card')[i].getElementsByClassName('bar')[0].innerHTML += "<div class='pow' style='background-image: url(sword.png); background-color: "+((j==0)?"red":(j==1)?"orange":(j==2)?"yellow":"green")+";' waiting='0' title='atk :"+card[num].attack[j]+", waiting : "+card[num].waiting[j]+", taken : "+ card[num].taken[j] +"' onclick='atk("+card[num].attack[j]+","+num+","+(i>=4?1:0)+")'></div>";
        
    }

}
// asign health to players
document.getElementsByClassName('health')[0].innerText = health[0];
document.getElementsByClassName('health')[1].innerText = health[1];


function atk(val,num,player){
    if(turn!=(player%2==0)){
       warn("Not your turn!");
        return;
    }
    enemy = 1;
    if(enemy==player)
        enemy--;
        if(document.getElementsByClassName('card')[card[num].id].getElementsByClassName('pow')[card[num].attack.indexOf(val)].getAttribute('waiting')>0){
            
            warn("move is in waiting!");
            return;
        }
    if(val>0){
        health[enemy]-=val;
        
        if(health[enemy]<=0)   
            health[enemy]=0;
        document.getElementsByClassName('health')[enemy].innerText = health[enemy];
        document.getElementsByClassName('health')[enemy].style.animationPlayState = 'running';
       
        setTimeout(()=>{
            document.getElementsByClassName('health')[enemy].style.animationPlayState = 'paused';
        },990);
    }
    else {
        health[player]-= val;
        document.getElementsByClassName('health')[player].innerText = health[player];
    }
    document.getElementsByClassName('card')[card[num].id].getElementsByClassName('pow')[card[num].attack.indexOf(val)].setAttribute('waiting',card[num].waiting[card[num].attack.indexOf(val)]);
    var atkBox = document.getElementsByClassName('pow');
    for(var i=0; i<atkBox.length;i++){
        if(atkBox[i]!=document.getElementsByClassName('card')[card[num].id].getElementsByClassName('pow')[card[num].attack.indexOf(val)]){
        var toWait = document.getElementsByClassName('pow')[i].getAttribute('waiting');
        document.getElementsByClassName('pow')[i].setAttribute('waiting', parseInt(toWait)- card[num].taken[card[num].attack.indexOf(val)]);
        }
    }
    win();
    turn=!turn;
    //console.log(val+" "+num+" "+player);
}

function win(){
    var winner;
    if(health[0]<=0)
        winner = 1;
    else if(health[1]<=0)
        winner = 0;
    else
        return;
    maxHealth += 500;
    health = [maxHealth,maxHealth];
    document.getElementsByClassName('health')[0].innerText = health[0];
    document.getElementsByClassName('health')[1].innerText = health[1];
    turn = true;
    var atkBox = document.getElementsByClassName('pow');
    for(var i=0; i<atkBox.length;i++){       
        document.getElementsByClassName('pow')[i].setAttribute('waiting', 0);
        }

    document.getElementById('win').innerText = (winner==0?"MITRA":"SHATRU")+" RAJYA";
    document.getElementsByClassName('winner')[0].style.visibility = 'visible';
    document.getElementsByClassName('winner')[0].style.height = '50vh';
}

function warn(str){
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
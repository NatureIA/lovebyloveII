const start=new Date('2026-06-12T00:00:00');

const timer=document.getElementById('timer');
const play=document.getElementById('play');
const audio=document.getElementById('audio');
const slide=document.getElementById('slide');
const typed=document.getElementById('typed');
const centralHeart=document.getElementById('centralHeart');
const musicLabel=document.getElementById('musicLabel');

function tick(){
const now=new Date();
let diff=now-start;
let s=Math.floor(diff/1000);
let d=Math.floor(s/86400); s%=86400;
let h=Math.floor(s/3600); s%=3600;
let m=Math.floor(s/60); s%=60;

timer.textContent=`${d} dias ${h}h ${m}m ${s}s`;
}

setInterval(tick,1000);
tick();

function createFloatingHeart(initial=false){
const h=document.createElement('div');

h.className='heart';
h.textContent=Math.random()>.15?'❤':'♥';
h.style.left=Math.random()*100+'vw';
h.style.fontSize=(14+Math.random()*24)+'px';
h.style.animationDuration=(5.5+Math.random()*5)+'s';
h.style.opacity=(.35+Math.random()*.5).toFixed(2);

if(initial){
h.style.bottom=(-30+Math.random()*innerHeight)+'px';
}

document.body.appendChild(h);

setTimeout(()=>h.remove(),11000);
}

function explodeHearts(x,y,amount=90){

const colors=[
'#ff2f76',
'#ff4d88',
'#ff75a5',
'#ff9abd',
'#ffc2d8',
'#ffffff'
];

for(let i=0;i<amount;i++){

const heart=document.createElement('span');

heart.className='burst-heart';
heart.textContent=Math.random()>.12?'❤':'♥';

const angle=Math.random()*Math.PI*2;
const distance=75+Math.random()*Math.min(innerWidth,470);

heart.style.setProperty('--start-x',`${x}px`);
heart.style.setProperty('--start-y',`${y}px`);

heart.style.setProperty(
'--move-x',
`${Math.cos(angle)*distance}px`
);

heart.style.setProperty(
'--move-y',
`${Math.sin(angle)*distance}px`
);

heart.style.setProperty(
'--heart-size',
`${12+Math.random()*25}px`
);

heart.style.setProperty(
'--scale',
`${.55+Math.random()*1.2}`
);

heart.style.setProperty(
'--rotation',
`${Math.random()*720-360}deg`
);

heart.style.setProperty(
'--duration',
`${1100+Math.random()*950}ms`
);

heart.style.setProperty(
'--heart-color',
colors[Math.floor(Math.random()*colors.length)]
);

document.body.appendChild(heart);

setTimeout(()=>heart.remove(),2200);
}
}


/* ============================= */
/* PLAYER DE MÚSICA              */
/* ============================= */

let musicStarting=false;

async function playMusicAndAnimate(event){

const rect=centralHeart.getBoundingClientRect();

const x=
event?.clientX ??
rect.left+rect.width/2;

const y=
event?.clientY ??
rect.top+rect.height/2;


/* animação do coração */

centralHeart.classList.remove('clicked');

void centralHeart.offsetWidth;

centralHeart.classList.add('clicked');

explodeHearts(x,y,110);


/*
Impede uma segunda tentativa de reprodução
enquanto play() ainda está sendo processado.
*/

if(musicStarting){
return;
}


/*
Se já estiver tocando, apenas mantém a música.
O coração continua executando sua animação.
*/

if(!audio.paused){
return;
}


musicStarting=true;

try{

audio.muted=false;
audio.volume=1;


/*
IMPORTANTE:
não usamos audio.load() aqui.
Executar load() enquanto play() está pendente
também pode provocar AbortError.
*/

await audio.play();


play.textContent='⏸ Pausar Música';

musicLabel.textContent=
'Dunshine - Delacruz • tocando';


}catch(error){

console.error(
'Erro ao reproduzir música:',
error
);

play.textContent=
'▶ Tentar novamente';

musicLabel.textContent=
`Erro: ${error.name} - ${error.message}`;

}finally{

musicStarting=false;

}

}


/* clique no coração central */

centralHeart.addEventListener(
'click',
async (event)=>{

await playMusicAndAnimate(event);

}
);


/* botão da música */

play.addEventListener(
'click',
async (event)=>{

event.preventDefault();
event.stopPropagation();


/*
Enquanto play() ainda estiver iniciando,
o botão não pode executar pause().
*/

if(musicStarting){
return;
}


/* música já tocando */

if(!audio.paused){

audio.pause();

play.textContent=
'▶ Nossa Música';

musicLabel.textContent=
'Dunshine - Delacruz • pausada';

return;

}


/* música parada */

await playMusicAndAnimate(event);

}
);


/* ============================= */
/* FOTOS                         */
/* ============================= */

const imgs=[
'https://placehold.co/900x600/png?text=Foto+1',
'https://placehold.co/900x600/png?text=Foto+2',
'https://placehold.co/900x600/png?text=Foto+3'
];

let i=0;

setInterval(()=>{

i=(i+1)%imgs.length;

slide.src=imgs[i];

},4000);


/* ============================= */
/* CARTA                         */
/* ============================= */

const text=
'Esta é uma carta provisória. Quando você me enviar a carta verdadeira, ela será substituída por completo com efeito de digitação.';

let p=0;

function type(){

if(p<text.length){

typed.textContent+=text[p++];

setTimeout(type,35);

}

}

type();


/* ============================= */
/* CORAÇÕES                      */
/* ============================= */


/* Corações naturais ao abrir */

for(let n=0;n<28;n++){

setTimeout(
()=>createFloatingHeart(true),
n*55
);

}


/* Corações naturais durante toda a navegação */

setInterval(
()=>createFloatingHeart(false),
620
);


/* Explosão inicial suave sem alterar o layout */

window.addEventListener(
'load',
()=>{

setTimeout(()=>{

const rect=
centralHeart.getBoundingClientRect();

explodeHearts(
rect.left+rect.width/2,
rect.top+rect.height/2,
55
);

},500);

}
);

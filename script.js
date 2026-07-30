const start=new Date('2026-06-12T00:00:00');

const timer=document.getElementById('timer');
const play=document.getElementById('play');
const audio=document.getElementById('audio');
const slide=document.getElementById('slide');
const typed=document.getElementById('typed');
const centralHeart=document.getElementById('centralHeart');
const musicStatus=document.getElementById('musicStatus');

function tick(){
 const now=new Date();
 let diff=Math.max(0,now-start);
 let s=Math.floor(diff/1000);
 let d=Math.floor(s/86400); s%=86400;
 let h=Math.floor(s/3600); s%=3600;
 let m=Math.floor(s/60); s%=60;
 timer.textContent=`${d} dias ${h}h ${m}m ${s}s`;
}
setInterval(tick,1000);
tick();

function createBurst(x,y,amount=90){
 const colors=['#ff2f76','#ff5c9b','#ff82b1','#ffb1cf','#ffffff'];
 for(let i=0;i<amount;i++){
   const heart=document.createElement('span');
   heart.className='burst-heart';
   heart.textContent=Math.random()>.13?'❤':'♥';
   const angle=Math.random()*Math.PI*2;
   const distance=80+Math.random()*Math.min(innerWidth,520);
   heart.style.setProperty('--start-x',`${x}px`);
   heart.style.setProperty('--start-y',`${y}px`);
   heart.style.setProperty('--heart-x',`${Math.cos(angle)*distance}px`);
   heart.style.setProperty('--heart-y',`${Math.sin(angle)*distance}px`);
   heart.style.setProperty('--heart-size',`${12+Math.random()*27}px`);
   heart.style.setProperty('--heart-scale',`${.55+Math.random()*1.25}`);
   heart.style.setProperty('--heart-rotate',`${Math.random()*720-360}deg`);
   heart.style.setProperty('--heart-duration',`${1100+Math.random()*1000}ms`);
   heart.style.setProperty('--heart-color',colors[Math.floor(Math.random()*colors.length)]);
   document.body.appendChild(heart);
   setTimeout(()=>heart.remove(),2300);
 }

 for(let i=0;i<28;i++){
   const sparkle=document.createElement('span');
   sparkle.className='sparkle';
   const angle=Math.random()*Math.PI*2;
   const distance=55+Math.random()*210;
   sparkle.style.setProperty('--start-x',`${x}px`);
   sparkle.style.setProperty('--start-y',`${y}px`);
   sparkle.style.setProperty('--spark-x',`${Math.cos(angle)*distance}px`);
   sparkle.style.setProperty('--spark-y',`${Math.sin(angle)*distance}px`);
   document.body.appendChild(sparkle);
   setTimeout(()=>sparkle.remove(),1100);
 }
}

function startMusicAndAnimation(origin){
 const rect=centralHeart.getBoundingClientRect();
 const x=origin?.clientX ?? rect.left+rect.width/2;
 const y=origin?.clientY ?? rect.top+rect.height/2;

 centralHeart.classList.remove('is-clicked');
 void centralHeart.offsetWidth;
 centralHeart.classList.add('is-clicked');
 createBurst(x,y,110);

 audio.play().then(()=>{
   play.textContent='⏸ Pausar Música';
   musicStatus.textContent='Sunshine — Delacruz • tocando';
 }).catch(()=>{
   musicStatus.textContent='Adicione assets/musica/musica.mp3 e toque novamente';
 });
}

centralHeart.addEventListener('click',startMusicAndAnimation);

play.addEventListener('click',(event)=>{
 if(audio.paused){
   startMusicAndAnimation(event);
 }else{
   audio.pause();
   play.textContent='▶ Nossa Música';
   musicStatus.textContent='Sunshine — Delacruz • pausada';
 }
});

audio.addEventListener('ended',()=>{
 audio.currentTime=0;
 audio.play().catch(()=>{});
});

const imgs=[
 'https://placehold.co/900x600/png?text=Foto+1',
 'https://placehold.co/900x600/png?text=Foto+2',
 'https://placehold.co/900x600/png?text=Foto+3'
];

let i=0;
setInterval(()=>{
 slide.classList.add('is-changing');
 setTimeout(()=>{
   i=(i+1)%imgs.length;
   slide.src=imgs[i];
   slide.onload=()=>slide.classList.remove('is-changing');
 },380);
},4000);

const text='Esta é uma carta provisória. Quando você me enviar a carta verdadeira, ela será substituída por completo com efeito de digitação.';
let p=0;
function type(){
 if(p<text.length){
   typed.textContent+=text[p++];
   setTimeout(type,35);
 }
}
type();

function createFloatingHeart(initial=false){
 const h=document.createElement('div');
 h.className='heart';
 h.textContent='❤';
 h.style.left=Math.random()*100+'vw';
 h.style.fontSize=(14+Math.random()*27)+'px';
 h.style.animationDuration=(5.5+Math.random()*5)+'s';
 h.style.opacity=(.35+Math.random()*.55).toFixed(2);
 if(initial){
   h.style.bottom=(-20+Math.random()*innerHeight)+'px';
 }
 document.body.appendChild(h);
 setTimeout(()=>h.remove(),11000);
}

for(let n=0;n<24;n++){
 setTimeout(()=>createFloatingHeart(true),n*55);
}
setInterval(()=>createFloatingHeart(false),650);

window.addEventListener('load',()=>{
 setTimeout(()=>{
   createBurst(innerWidth/2,innerHeight*.42,75);
 },350);
});

const animatedSections=document.querySelectorAll('section:not(.hero), .card, .gallery img');
animatedSections.forEach(el=>el.classList.add('reveal'));

const observer=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{
   if(entry.isIntersecting){
     entry.target.classList.add('visible');
     observer.unobserve(entry.target);
   }
 });
},{threshold:.15});

animatedSections.forEach(el=>observer.observe(el));

document.addEventListener('pointerdown',event=>{
 if(event.target.closest('button')) return;
 if(Math.random()>.35) createBurst(event.clientX,event.clientY,12);
});

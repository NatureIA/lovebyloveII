
const startDate=new Date("2026-06-12T00:00:00");
const c=document.getElementById("contador");
function tick(){
 let d=new Date()-startDate;
 let s=Math.floor(d/1000),days=Math.floor(s/86400);s%=86400;
 let h=Math.floor(s/3600);s%=3600;let m=Math.floor(s/60);s%=60;
 c.textContent=`${days} dias • ${h}h ${m}m ${s}s`;
}
setInterval(tick,1000);tick();

const music=document.getElementById("music");
function burst(){
 for(let i=0;i<120;i++){
   const e=document.createElement("div");
   e.className="heart";
   e.textContent="❤";
   e.style.left=(innerWidth/2)+"px";
   e.style.top=(innerHeight/2)+"px";
   e.style.setProperty("--x",(Math.random()*800-400)+"px");
   e.style.fontSize=(12+Math.random()*28)+"px";
   document.body.appendChild(e);
   setTimeout(()=>e.remove(),3000);
 }
}
document.getElementById("start").onclick=()=>{
 music.play().catch(()=>{});
 burst();
 document.getElementById("hero").scrollIntoView({behavior:"smooth"});
};
document.getElementById("heart").onclick=()=>document.getElementById("start").click();

const canvas=document.getElementById("bg");
const ctx=canvas.getContext("2d");
function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
addEventListener("resize",resize);resize();
const pts=[...Array(120)].map(()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*2+1,v:Math.random()*0.5+0.2}));
function anim(){
 ctx.fillStyle="#12041f";ctx.fillRect(0,0,canvas.width,canvas.height);
 pts.forEach(p=>{p.y-=p.v;if(p.y<0)p.y=canvas.height;ctx.fillStyle="rgba(255,120,200,.8)";ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();});
 requestAnimationFrame(anim);
}
anim();

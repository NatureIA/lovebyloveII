const start = new Date('2026-06-12T00:00:00');

const timer = document.getElementById('timer');
const play = document.getElementById('play');
const audio = document.getElementById('audio');
const slide = document.getElementById('slide');
const typed = document.getElementById('typed');
const centralHeart = document.getElementById('centralHeart');
const musicLabel = document.getElementById('musicLabel');
const fotoStatus = document.getElementById('fotoStatus');

// ========== TIMER ===========
function tick() {
  const now = new Date();
  let diff = now - start;
  let s = Math.floor(diff / 1000);
  let d = Math.floor(s / 86400);
  s %= 86400;
  let h = Math.floor(s / 3600);
  s %= 3600;
  let m = Math.floor(s / 60);
  s %= 60;
  timer.textContent = `${d} dias ${h}h ${m}m ${s}s`;
}
setInterval(tick, 1000);
tick();

// ========== CORAÇÕES FLUTUANTES ==========
function createFloatingHeart(initial = false) {
  const h = document.createElement('div');
  h.className = 'heart';
  h.textContent = Math.random() > 0.15 ? '❤' : '♥';
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = (14 + Math.random() * 24) + 'px';
  h.style.animationDuration = (5.5 + Math.random() * 5) + 's';
  h.style.opacity = (0.35 + Math.random() * 0.5).toFixed(2);
  if (initial) {
    h.style.bottom = (-30 + Math.random() * innerHeight) + 'px';
  }
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 11000);
}

// ========== EXPLOSÃO DE CORAÇÕES ==========
function explodeHearts(x, y, amount = 90) {
  const colors = ['#ff2f76', '#ff4d88', '#ff75a5', '#ff9abd', '#ffc2d8', '#ffffff'];
  for (let i = 0; i < amount; i++) {
    const heart = document.createElement('span');
    heart.className = 'burst-heart';
    heart.textContent = Math.random() > 0.12 ? '❤' : '♥';
    const angle = Math.random() * Math.PI * 2;
    const distance = 75 + Math.random() * Math.min(innerWidth, 470);
    heart.style.setProperty('--start-x', `${x}px`);
    heart.style.setProperty('--start-y', `${y}px`);
    heart.style.setProperty('--move-x', `${Math.cos(angle) * distance}px`);
    heart.style.setProperty('--move-y', `${Math.sin(angle) * distance}px`);
    heart.style.setProperty('--heart-size', `${12 + Math.random() * 25}px`);
    heart.style.setProperty('--scale', `${0.55 + Math.random() * 1.2}`);
    heart.style.setProperty('--rotation', `${Math.random() * 720 - 360}deg`);
    heart.style.setProperty('--duration', `${1100 + Math.random() * 950}ms`);
    heart.style.setProperty('--heart-color', colors[Math.floor(Math.random() * colors.length)]);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2200);
  }
}

// ========== MÚSICA ==========
let musicaIniciada = false;

function iniciarMusica() {
  if (musicaIniciada) {
    // Se já estiver tocando, não faz nada (ou pode pausar se quiser)
    return;
  }

  audio.volume = 1.0;
  audio.muted = false;
  audio.play()
    .then(() => {
      musicaIniciada = true;
      play.textContent = '♫ Música Tocando';
      musicLabel.textContent = '🎵 Sunshine - Delacruz • tocando';
    })
    .catch((error) => {
      console.error('Erro ao tocar:', error);
      musicaIniciada = false;
      play.textContent = '▶ Nossa Música';
      musicLabel.textContent = 'Erro ao tocar música';
      alert('Clique novamente para tocar a música.');
    });
}

// ========== BOTÃO PLAY ==========
play.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  iniciarMusica();
});

// ========== CORAÇÃO CENTRAL ==========
centralHeart.addEventListener('click', (event) => {
  const rect = centralHeart.getBoundingClientRect();
  const x = event.clientX || rect.left + rect.width / 2;
  const y = event.clientY || rect.top + rect.height / 2;

  centralHeart.classList.remove('clicked');
  void centralHeart.offsetWidth;
  centralHeart.classList.add('clicked');

  explodeHearts(x, y, 110);
  iniciarMusica(); // também inicia a música
});

// ========== GALERIA DE FOTOS ==========
const numFotos = 18;
const imgs = Array.from({ length: numFotos }, (_, i) =>
  `assets/imagens/foto${String(i + 1).padStart(2, '0')}.png`
);

function testarImagem(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

async function carregarPrimeiraImagem() {
  for (let i = 0; i < imgs.length; i++) {
    const url = imgs[i];
    const ok = await testarImagem(url);
    if (ok) {
      slide.src = url;
      fotoStatus.textContent = `Foto ${i+1} de ${numFotos} carregada.`;
      console.log(`Imagem carregada: ${url}`);
      return i;
    } else {
      console.warn(`Falha ao carregar: ${url}`);
    }
  }
  slide.src = 'https://placehold.co/900x600/png?text=Fotos+n%C3%A3o+encontradas';
  fotoStatus.textContent = 'Nenhuma foto encontrada em assets/imagens/';
  console.error('Nenhuma imagem foi carregada.');
  return -1;
}

let currentIndex = 0;
carregarPrimeiraImagem().then((idx) => {
  if (idx >= 0) {
    currentIndex = idx;
    setInterval(() => {
      let next = (currentIndex + 1) % imgs.length;
      const tentar = async () => {
        for (let i = 0; i < imgs.length; i++) {
          const index = (next + i) % imgs.length;
          const url = imgs[index];
          const ok = await testarImagem(url);
          if (ok) {
            slide.src = url;
            fotoStatus.textContent = `Foto ${index+1} de ${numFotos}`;
            currentIndex = index;
            return;
          }
        }
      };
      tentar();
    }, 4000);
  }
});

// ========== CARTA ==========
const text = const text = `Meu amor, tentando ser breve, eu só queria que você soubesse o quanto eu te amo e o quanto você é importante para mim.

Desde que eu te conheci, de alguma forma, eu já sabia que era você. Que era com você que eu queria estar, com quem eu queria ficar, com quem eu quero casar e passar o resto da minha vida. Não é à toa que, desde o começo, eu já queria gritar para o mundo que você estava comigo, né? Hahaha.

Você chegou e, como eu te disse naquela primeira vez que subimos o Morro da Cruz: "Você trouxe movimento pra minha vida, você deu vida pra minha vida." E não é à toa que é filha de Yansã, né? Meu vendavalzinho!

Obrigado por tornar a minha vida imensuravelmente melhor, de uma forma que eu nem consigo colocar em palavras, ou como diz você, de forma "inenarrável". Obrigado por ser quem você é, por tudo o que trouxe para a minha vida e por tudo o que construímos nesses dois meses.

Eu sei que não sou perfeito, mas, à minha maneira e sempre tentando dar o meu melhor, eu te amo muito. E espero conseguir fazer por você, todos os dias, pelo menos um pouco do bem que você faz por mim.

Novamente, obrigado por esses dois meses juntos, por todo o movimento, por todos os momentos e, principalmente, por toda a alegria que você trouxe para a minha vida.

Eu te amo muito! ❤️

Você é o amor da minha vida! ❤️`;

let pos = 0;
function type() {
  if (pos < text.length) {
    typed.textContent += text[pos++];
    setTimeout(type, 35);
  }
}
type();

// ========== CORAÇÕES INICIAIS ==========
for (let n = 0; n < 28; n++) {
  setTimeout(() => createFloatingHeart(true), n * 55);
}
setInterval(() => createFloatingHeart(false), 620);

window.addEventListener('load', () => {
  setTimeout(() => {
    const rect = centralHeart.getBoundingClientRect();
    explodeHearts(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      55
    );
  }, 500);
});

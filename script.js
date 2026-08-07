const start = new Date('2026-06-12T00:00:00');

const timer = document.getElementById('timer');
const play = document.getElementById('play');
const audio = document.getElementById('audio');
const slide = document.getElementById('slide');
const typed = document.getElementById('typed');
const centralHeart = document.getElementById('centralHeart');
const musicLabel = document.getElementById('musicLabel');

// ========== TIMER ==========
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

async function iniciarMusica() {
  if (musicaIniciada) return;

  try {
    audio.muted = false;
    audio.volume = 1.0;
    await audio.play();
    musicaIniciada = true;
    play.textContent = '♫ Música Tocando';
    musicLabel.textContent = 'Dunshine - Delacruz • tocando';
  } catch (error) {
    musicaIniciada = false;
    console.error('ERRO AO REPRODUZIR ÁUDIO:', error);
    play.textContent = '▶ Tocar Música';
    musicLabel.textContent = `Erro: ${error.name} - ${error.message}`;
  }
}

// Evento de erro do áudio (fallback)
audio.addEventListener('error', () => {
  musicaIniciada = false;
  console.error('ERRO NO ELEMENTO ÁUDIO:', audio.error);
  play.textContent = '▶ Tocar Música';
  if (audio.error) {
    musicLabel.textContent = `Erro do áudio: código ${audio.error.code}`;
  } else {
    musicLabel.textContent = 'Erro ao carregar a música';
  }
});

// Quando a música começar a tocar de fato
audio.addEventListener('playing', () => {
  musicaIniciada = true;
  play.textContent = '♫ Música Tocando';
  musicLabel.textContent = 'Dunshine - Delacruz • tocando';
});

// ========== CORAÇÃO CENTRAL ==========
centralHeart.addEventListener('click', (event) => {
  const rect = centralHeart.getBoundingClientRect();
  const x = event.clientX || rect.left + rect.width / 2;
  const y = event.clientY || rect.top + rect.height / 2;

  centralHeart.classList.remove('clicked');
  void centralHeart.offsetWidth; // reinicia a animação
  centralHeart.classList.add('clicked');

  explodeHearts(x, y, 110);
  iniciarMusica();
});

// ========== BOTÃO PLAY ==========
play.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  iniciarMusica();
});

// ========== GALERIA DE FOTOS (CORRIGIDO) ==========
// Gera automaticamente os caminhos para foto01.png até foto18.png
const imgs = Array.from({ length: 18 }, (_, i) =>
  `assets/imagens/foto${String(i + 1).padStart(2, '0')}.png`
);

let idx = 0;
// Define a primeira imagem imediatamente
slide.src = imgs[0];

setInterval(() => {
  idx = (idx + 1) % imgs.length;
  slide.src = imgs[idx];
}, 4000);

// ========== CARTA COM EFEITO DE DIGITAÇÃO ==========
const text = 'Esta é uma carta provisória. Quando você me enviar a carta verdadeira, ela será substituída por completo com efeito de digitação.';
let pos = 0;

function type() {
  if (pos < text.length) {
    typed.textContent += text[pos++];
    setTimeout(type, 35);
  }
}
type();

// ========== INICIALIZAÇÃO DOS CORAÇÕES ==========
// Corações naturais ao abrir
for (let n = 0; n < 28; n++) {
  setTimeout(() => createFloatingHeart(true), n * 55);
}

// Corações contínuos
setInterval(() => createFloatingHeart(false), 620);

// Pequena explosão inicial suave ao carregar
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

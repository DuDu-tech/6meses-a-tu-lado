/**
 * audio.js — Reproductor con AudioContext
 * Compatibilidad máxima con GitHub Pages / Live Server
 *
 * Uso en HTML:
 *   <audio id="bgAudio" loop>
 *     <source src="song.mp3" type="audio/mpeg">
 *   </audio>
 *   <button id="playBtn" onclick="toggleAudio()">▶</button>
 *   <div class="audio-progress" onclick="seekAudio(event)">
 *     <div class="audio-fill" id="audioFill"></div>
 *   </div>
 *   <script src="audio.js"></script>
 */

const audioEl = document.getElementById('bgAudio');
const playBtn = document.getElementById('playBtn');
const fill    = document.getElementById('audioFill');

let playing  = false;
let audioCtx = null;
let gainNode = null;

/**
 * Inicializa el AudioContext una sola vez.
 * Debe llamarse desde un evento de usuario (click/touch).
 */
function initAudio() {
  if (audioCtx) return;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Conectar el elemento <audio> al contexto
  const source = audioCtx.createMediaElementSource(audioEl);

  // Nodo de volumen
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.8;

  // Cadena: source → gain → salida
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
}

/**
 * Alterna play / pause al presionar el botón.
 */
function toggleAudio() {
  initAudio();

  if (playing) {
    audioEl.pause();
    audioCtx.suspend();
    playBtn.innerHTML = '&#9654;'; // ▶
    playing = false;
  } else {
    audioCtx.resume().then(() => {
      audioEl.play()
        .then(() => {
          playBtn.innerHTML = '&#9646;&#9646;'; // ⏸
          playing = true;
        })
        .catch(err => {
          console.warn('Error al reproducir:', err);
          playBtn.innerHTML = '&#9654;';
        });
    });
  }
}

/**
 * Actualiza la barra de progreso mientras suena.
 */
audioEl.addEventListener('timeupdate', () => {
  if (audioEl.duration) {
    fill.style.width = (audioEl.currentTime / audioEl.duration * 100) + '%';
  }
});

/**
 * Resetea el botón cuando termina la canción.
 */
audioEl.addEventListener('ended', () => {
  playing = false;
  playBtn.innerHTML = '&#9654;';
  fill.style.width = '0%';
});

/**
 * Permite hacer clic en la barra para saltar a ese punto.
 */
function seekAudio(e) {
  if (!audioEl.duration) return;
  const pct = e.offsetX / e.currentTarget.offsetWidth;
  audioEl.currentTime = pct * audioEl.duration;
}
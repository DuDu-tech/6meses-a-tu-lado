document.addEventListener('DOMContentLoaded', function() {
  const audioEl = document.getElementById('bgAudio');
  const playBtn = document.getElementById('playBtn');
  const fill    = document.getElementById('audioFill');

  if (!audioEl || !playBtn) {
    console.error('No se encontró el elemento audio o el botón');
    return;
  }

  let playing  = false;
  let audioCtx = null;
  let source   = null;
  let gainNode = null;

  function initAudio() {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      source   = audioCtx.createMediaElementSource(audioEl);
      gainNode = audioCtx.createGain();
      gainNode.gain.value = 0.8;
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
    } catch(e) {
      console.error('Error al crear AudioContext:', e);
    }
  }

  window.toggleAudio = function() {
    initAudio();

    if (playing) {
      audioEl.pause();
      playBtn.innerHTML = '&#9654;';
      playing = false;
    } else {
      if (audioCtx) audioCtx.resume();
      audioEl.play()
        .then(function() {
          playBtn.innerHTML = '&#9646;&#9646;';
          playing = true;
        })
        .catch(function(err) {
          console.error('Error al reproducir:', err);
        });
    }
  };

  window.seekAudio = function(e) {
    if (!audioEl.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    audioEl.currentTime = pct * audioEl.duration;
  };

  audioEl.addEventListener('timeupdate', function() {
    if (audioEl.duration && fill) {
      fill.style.width = (audioEl.currentTime / audioEl.duration * 100) + '%';
    }
  });

  audioEl.addEventListener('ended', function() {
    playing = false;
    playBtn.innerHTML = '&#9654;';
    if (fill) fill.style.width = '0%';
  });

  audioEl.addEventListener('error', function(e) {
    console.error('Error cargando el audio:', e);
    console.error('Código de error:', audioEl.error ? audioEl.error.code : 'desconocido');
  });

  console.log('Audio.js cargado correctamente');
  console.log('Buscando song.mp3...');
});

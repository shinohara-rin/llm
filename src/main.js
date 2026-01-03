import './style.css';

document.querySelector('#app').innerHTML = `
  <div class="flex items-center justify-center h-full">
    <div class="text-center p-8 border-4 border-[var(--color-neon-purple)] shadow-[0_0_20px_var(--color-neon-purple)] bg-black/80 backdrop-blur-md">
      <h1 class="text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] drop-shadow-[0_0_10px_rgba(176,38,255,0.8)]">
        LLM
      </h1>
      <p class="text-xl text-[var(--color-neon-blue)] tracking-widest uppercase mb-8">
        Lo-Fi Looping Machine
      </p>
      <button id="start-btn" class="px-8 py-3 bg-[var(--color-neon-purple)] text-black font-bold text-xl hover:bg-white hover:shadow-[0_0_30px_white] transition-all duration-300 cursor-pointer">
        INITIALIZE SYSTEM
      </button>
    </div>
  </div>
`;

console.log('Use ./audio/engine.js for audio context');

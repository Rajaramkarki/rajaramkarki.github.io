(() => {
  const key = 'rk-appearance-v1';
  const modes = ['system', 'light', 'dark'];
  const palettes = ['grove', 'ocean', 'ember'];
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = { mode: 'system', palette: 'grove' };
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && modes.includes(saved.mode)) preference.mode = saved.mode;
    if (saved && palettes.includes(saved.palette)) preference.palette = saved.palette;
  } catch { /* Appearance still works when storage is unavailable. */ }
  function apply() {
    const resolved = preference.mode === 'system' ? (media.matches ? 'dark' : 'light') : preference.mode;
    document.documentElement.dataset.mode = resolved;
    document.documentElement.dataset.palette = preference.palette;
    document.documentElement.style.colorScheme = resolved;
    document.querySelectorAll('[data-mode-choice]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.modeChoice === preference.mode)));
    document.querySelectorAll('[data-palette-choice]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.paletteChoice === preference.palette)));
    const label = document.querySelector('#theme-current');
    if (label) label.textContent = `${resolved === 'light' ? 'Light' : 'Dark'} · ${preference.palette[0].toUpperCase() + preference.palette.slice(1)}`;
  }
  apply();
  media.addEventListener('change', () => { if (preference.mode === 'system') apply(); });
  document.addEventListener('DOMContentLoaded', () => {
    const picker = document.querySelector('#appearance');
    function save() { try { localStorage.setItem(key, JSON.stringify(preference)); } catch {} apply(); }
    document.querySelectorAll('[data-mode-choice]').forEach(b => b.addEventListener('click', () => { preference.mode = b.dataset.modeChoice; save(); }));
    document.querySelectorAll('[data-palette-choice]').forEach(b => b.addEventListener('click', () => { preference.palette = b.dataset.paletteChoice; save(); }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && picker.open) { picker.open = false; picker.querySelector('summary').focus(); } });
    document.addEventListener('click', e => { if (picker.open && !picker.contains(e.target)) picker.open = false; });
    apply();
  });
})();

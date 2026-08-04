(() => {
  const send = (type, payload = {}) => parent.postMessage({ source: 'punan-web', type, ...payload }, '*');

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-punan-url]');
    if (!link) return;
    event.preventDefault();
    send('navigate', { url: link.dataset.punanUrl });
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-punan-search]');
    if (!form) return;
    event.preventDefault();
    const input = form.querySelector('input[name="q"], input[name="keyword"]');
    const base = form.dataset.punanSearch;
    const separator = base.includes('?') ? '&' : '?';
    send('navigate', { url: `${base}${separator}keyword=${encodeURIComponent(input?.value || '')}` });
  });

  document.documentElement.dataset.punanMirror = 'true';
})();

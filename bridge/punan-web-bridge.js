(() => {
  const send = (type, payload = {}) => parent.postMessage({ source: 'punan-web', type, ...payload }, '*');

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-punan-url]');
    if (!link) return;
    event.preventDefault();
    send(event.ctrlKey || event.metaKey ? 'open-new-window' : 'navigate', { url: link.dataset.punanUrl });
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

  const hydrateProgressiveImage = (image) => {
    if (!(image instanceof HTMLImageElement) || image.dataset.punanProgressiveBound === 'true') return;
    const target = image.dataset.punanFullSrc;
    if (!target) return;
    image.dataset.punanProgressiveBound = 'true';
    image.dataset.punanImageState = 'preview';
    const begin = () => {
      const full = new Image();
      full.decoding = 'async';
      full.onload = () => {
        image.src = target;
        image.dataset.punanImageState = 'screen';
      };
      full.onerror = () => {
        image.dataset.punanImageState = 'preview-error';
        image.title ||= '清晰图载入失败，当前显示预览图';
      };
      full.src = target;
    };
    if (image.complete && image.naturalWidth > 0) queueMicrotask(begin);
    else image.addEventListener('load', begin, { once: true });
  };

  document.querySelectorAll('img[data-punan-full-src]').forEach(hydrateProgressiveImage);
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.matches('img[data-punan-full-src]')) hydrateProgressiveImage(node);
      node.querySelectorAll?.('img[data-punan-full-src]').forEach(hydrateProgressiveImage);
    }));
  }).observe(document.documentElement, { childList: true, subtree: true });
})();

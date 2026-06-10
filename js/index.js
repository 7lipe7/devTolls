(() => {
  function getPreText(sectionEl) {
    const pre = sectionEl.querySelector('pre');
    return (pre?.textContent || '').trim();
  }

  function buildIframeDoc({ mode, code }) {
    const safeTitle = mode.toUpperCase();

    if (mode === 'html') {
      return `<!doctype html><html><head><meta charset="utf-8"><title>${safeTitle}</title></head><body><h>${code}</body></html>`;
    }

    if (mode === 'css') {
      return `<!doctype html><html><head><meta charset="utf-8"><title>${safeTitle}</title><style>${code}</style></head><body><h1>Resultado CSS</h1></body></html>`;
    }

    return `<!doctype html><html><head><meta charset="utf-8"><title>${safeTitle}</title></head><body><h1>Resultado CSS</h1><script>${code}\n</script> </body></html>`;
  }

  function init() {
    const tryButtons = Array.from(document.querySelectorAll('.try-btn'));
    if (!tryButtons.length) return;


    document.getElementById('try-output')?.remove();

    tryButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const sectionEl = btn.closest('.section');
        if (!sectionEl) return;

        const mode = sectionEl.classList.contains('html')
          ? 'html'
          : sectionEl.classList.contains('css')
            ? 'css'
            : 'js';

        const codeRaw = getPreText(sectionEl);
        const codeBox = btn.closest('.code-box');
        if (!codeBox) return;

       
        codeBox.querySelector('button.try-output__close')?.remove();

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'try-output__close';
        closeBtn.textContent = 'Fechar';
        btn.insertAdjacentElement('afterend', closeBtn);

        closeBtn.addEventListener('click', () => {
          const iframeEl = codeBox.querySelector('iframe');
          if (iframeEl) {
            iframeEl.srcdoc = '';
            iframeEl.remove();
          }
          closeBtn.remove();
        });

       
        let iframe = codeBox.querySelector('iframe[data-try-iframe]');
        if (!iframe) {
          iframe = document.createElement('iframe');
          iframe.dataset.tryIframe = 'true';
          iframe.className = 'try-output__iframe';
          iframe.sandbox = 'allow-scripts allow-forms allow-modals';
          iframe.height = 320;
          iframe.style.width = '100%';
          iframe.style.marginTop = '12px';
          iframe.style.borderRadius = '10px';
          iframe.style.border = '1px solid rgba(226,232,240,0.25)';
          iframe.style.background = '#fff';
          codeBox.appendChild(iframe);
        }

        let finalCode = codeRaw;

        if (mode === 'html') {
         
          finalCode = codeRaw
            .replaceAll('&amp;', '&')
            .replaceAll('<', '<')
            .replaceAll('>', '>')
            .replaceAll('"', '"')
            .replaceAll('&#039;', "'");
        }

        iframe.srcdoc = buildIframeDoc({ mode, code: finalCode });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();


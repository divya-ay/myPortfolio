/* ---------- Scroll reveal ---------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ---------- Theme toggle ---------- */
const themeToggle = document.getElementById('themeToggle');
function currentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}
themeToggle.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  document.dispatchEvent(new CustomEvent('themechange', { detail: next }));
});

/* ---------- Mobile nav ---------- */
const toggle = document.getElementById('navToggle');
const links  = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  links.classList.toggle('open');
  toggle.classList.toggle('active');
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  toggle.classList.remove('active');
}));

/* ---------- Hero dot field (signature interactive element) ---------- */
(function initDotField() {
  const canvas = document.getElementById('dotField');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.closest('.hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0, height = 0;
  let dots = [];
  let mouse = { x: -9999, y: -9999, active: false };
  const SPACING = 34;
  const RADIUS = 120;
  const MAX_PUSH = 16;

  function buildGrid() {
    width = hero.offsetWidth;
    height = hero.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    dots = [];
    const cols = Math.ceil(width / SPACING) + 1;
    const rows = Math.ceil(height / SPACING) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const bx = c * SPACING;
        const by = r * SPACING;
        dots.push({
          bx, by, x: bx, y: by,
          amber: (r + c) % 5 === 0
        });
      }
    }
  }

  function getPalette() {
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue('--accent').trim() || '#ffb454';
    const accent2 = styles.getPropertyValue('--accent-2').trim() || '#7de0d3';
    const muted = styles.getPropertyValue('--muted').trim() || '#8b95a5';
    return { accent, accent2, muted };
  }
  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const n = h.length === 3
      ? h.split('').map(c => c + c).join('')
      : h;
    const num = parseInt(n, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  let palette = getPalette();
  document.addEventListener('themechange', () => { palette = getPalette(); });

  function step() {
    ctx.clearRect(0, 0, width, height);
    const [ar, ag, ab] = hexToRgb(palette.accent);
    const [tr, tg, tb] = hexToRgb(palette.accent2);
    const [mr, mg, mb] = hexToRgb(palette.muted);
    for (const d of dots) {
      let tx = d.bx, ty = d.by;
      if (mouse.active) {
        const dx = d.bx - mouse.x;
        const dy = d.by - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS) {
          const force = (1 - dist / RADIUS) * MAX_PUSH;
          const ang = Math.atan2(dy, dx);
          tx = d.bx + Math.cos(ang) * force;
          ty = d.by + Math.sin(ang) * force;
        }
      }
      d.x += (tx - d.x) * 0.15;
      d.y += (ty - d.y) * 0.15;

      const dx2 = d.x - mouse.x, dy2 = d.y - mouse.y;
      const near = mouse.active && Math.sqrt(dx2 * dx2 + dy2 * dy2) < RADIUS;

      ctx.beginPath();
      ctx.arc(d.x, d.y, near ? 2.1 : 1.4, 0, Math.PI * 2);
      if (d.amber) {
        ctx.fillStyle = near ? `rgba(${ar},${ag},${ab},0.85)` : `rgba(${ar},${ag},${ab},0.35)`;
      } else {
        ctx.fillStyle = near ? `rgba(${tr},${tg},${tb},0.7)` : `rgba(${mr},${mg},${mb},0.28)`;
      }
      ctx.fill();
    }
    requestAnimationFrame(step);
  }

  buildGrid();
  window.addEventListener('resize', buildGrid);

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  hero.addEventListener('mouseleave', () => { mouse.active = false; });
  hero.addEventListener('touchmove', (e) => {
    if (!e.touches.length) return;
    const rect = hero.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
    mouse.active = true;
  }, { passive: true });
  hero.addEventListener('touchend', () => { mouse.active = false; });

  if (!reduceMotion) {
    requestAnimationFrame(step);
  } else {
    step();
  }
})();

/* ---------- Hero photo parallax drift ---------- */
(function initPhotoParallax() {
  const hero = document.querySelector('.hero');
  const frame = document.querySelector('.photo-frame');
  if (!hero || !frame) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let targetX = 0, targetY = 0, curX = 0, curY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    targetX = relX * 18;
    targetY = relY * 18;
  });
  hero.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });

  function loop() {
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;
    frame.style.transform = `translate(${curX}px, ${curY}px)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ---------- Certificate modal (poster-style, shows PDF/image) ---------- */
const certModal = document.getElementById('certModal');
const certModalClose = document.getElementById('certModalClose');
const certModalBanner = document.getElementById('certModalBanner');
const certModalMark = document.getElementById('certModalMark');
const certModalTitle = document.getElementById('certModalTitle');
const certModalTags = document.getElementById('certModalTags');
const certModalSubtitle = document.getElementById('certModalSubtitle');
const certModalDocBody = document.getElementById('certModalDocBody');

const pdfjsAvailable = typeof window.pdfjsLib !== 'undefined';
if (pdfjsAvailable) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
}

async function renderPdf(src) {
  if (!pdfjsAvailable) throw new Error('PDF.js library not available');
  const response = await fetch(src);
  if (!response.ok) throw new Error('Failed to load certificate');
  const arrayBuffer = await response.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1.4 });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas;
}

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', async () => {
    const title = card.dataset.title;
    const subtitle = card.dataset.subtitle;
    const type = card.dataset.type;
    const src = card.dataset.src;
    const tags = (card.dataset.tags || '').split(',').map(t => t.trim()).filter(Boolean);
    const posterClass = [...card.classList].find(c => c.startsWith('cert-') && c !== 'cert-card');
    const mark = card.querySelector('.poster-mark')?.textContent || '';

    certModalTitle.textContent = title;
    certModalMark.textContent = mark;
    certModalBanner.className = 'project-modal-banner ' + posterClass;
    certModalSubtitle.textContent = subtitle;

    certModalTags.innerHTML = '';
    tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'project-tag-pill';
      span.textContent = tag;
      certModalTags.appendChild(span);
    });

    certModalDocBody.innerHTML = '';

    if (type === 'pdf') {
      if (!pdfjsAvailable) {
        certModalDocBody.innerHTML = `<div class="pdf-fallback"><p>PDF preview library failed to load. <a href="${src}" target="_blank" rel="noopener">Open the certificate in a new tab</a>.</p></div>`;
      } else {
        try {
          const canvas = await renderPdf(src);
          certModalDocBody.appendChild(canvas);
        } catch (error) {
          certModalDocBody.innerHTML = `<div class="pdf-fallback"><p>Unable to preview this PDF inline. <a href="${src}" target="_blank" rel="noopener">Open the certificate in a new tab</a>.</p></div>`;
          console.error('PDF preview error:', error);
        }
      }
    } else {
      certModalDocBody.innerHTML = `<img src="${src}" alt="${title} certificate"/>`;
    }

    certModal.classList.add('open');
    certModal.setAttribute('aria-hidden', 'false');
  });
});

const closeCertModal = () => {
  certModal.classList.remove('open');
  certModal.setAttribute('aria-hidden', 'true');
  certModalDocBody.innerHTML = '';
};
certModalClose.addEventListener('click', closeCertModal);
certModal.addEventListener('click', e => { if (e.target === certModal) closeCertModal(); });

/* ---------- Project (Netflix-style) modal ---------- */
const projectModal = document.getElementById('projectModal');
const projectModalClose = document.getElementById('projectModalClose');
const projectModalBanner = document.getElementById('projectModalBanner');
const projectModalMark = document.getElementById('projectModalMark');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalTags = document.getElementById('projectModalTags');
const projectModalDesc = document.getElementById('projectModalDesc');
const projectModalGithub = document.getElementById('projectModalGithub');

document.querySelectorAll('.poster-card:not(.cert-card)').forEach(card => {
  card.addEventListener('click', () => {
    const title = card.dataset.title;
    const year = card.dataset.year;
    const type = card.dataset.type;
    const tags = (card.dataset.tags || '').split(',').map(t => t.trim()).filter(Boolean);
    const desc = card.dataset.desc;
    const github = card.dataset.github;
    const posterClass = [...card.classList].find(c => c.startsWith('poster-') && c !== 'poster-card');
    const mark = card.querySelector('.poster-mark')?.textContent || '';

    projectModalTitle.textContent = title;
    projectModalMark.textContent = mark;
    projectModalBanner.className = 'project-modal-banner ' + posterClass;
    projectModalDesc.textContent = desc;

    projectModalTags.innerHTML = '';
    [year, type, ...tags].filter(Boolean).forEach(tag => {
      const span = document.createElement('span');
      span.className = 'project-tag-pill';
      span.textContent = tag;
      projectModalTags.appendChild(span);
    });

    if (github) {
      projectModalGithub.href = github;
      projectModalGithub.style.display = 'inline-flex';
    } else {
      projectModalGithub.style.display = 'none';
    }

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
  });
});

const closeProjectModal = () => {
  projectModal.classList.remove('open');
  projectModal.setAttribute('aria-hidden', 'true');
};
projectModalClose.addEventListener('click', closeProjectModal);
projectModal.addEventListener('click', e => { if (e.target === projectModal) closeProjectModal(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (certModal.classList.contains('open')) closeCertModal();
    if (projectModal.classList.contains('open')) closeProjectModal();
  }
});
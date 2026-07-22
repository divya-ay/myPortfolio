/* ---------- Scroll reveal ---------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('show');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ---------- Theme toggle ---------- */
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
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

/* ---------- Project poster photos ----------
   Fill in data-img="images/your-screenshot.jpg" on any .project-card
   in index.html and it'll replace the gradient placeholder automatically. */

const techIcons = {
  "Python": "devicon-python-plain colored",
  "Java": "devicon-java-plain colored",
  "JavaScript": "devicon-javascript-plain colored",
  "TypeScript": "devicon-typescript-plain colored",
  "HTML": "devicon-html5-plain colored",
  "CSS": "devicon-css3-plain colored",
  "Django": "devicon-django-plain colored",
  "React": "devicon-react-original colored",
  "React Native": "devicon-react-original colored",
  "Node.js": "devicon-nodejs-plain colored",
  "Express": "devicon-express-original",
  "PostgreSQL": "devicon-postgresql-plain colored",
  "MySQL": "devicon-mysql-plain colored",
  "Docker": "devicon-docker-plain colored",
  "Git": "devicon-git-plain colored",
  "GitHub": "devicon-github-original",
  "Pandas": "devicon-pandas-original colored",
  "NumPy": "devicon-numpy-original colored",
  "Scikit-Learn": "devicon-scikitlearn-plain colored",
  "Jupyter": "devicon-jupyter-plain colored",
  "Matplotlib": "devicon-matplotlib-plain colored",
  "Figma": "devicon-figma-plain colored"
};

document.querySelectorAll('.project-card').forEach(card => {
  const img = card.dataset.img;
  if (img && img.trim() !== '') {
    card.style.backgroundImage = `url('${img}')`;
    card.classList.add('has-photo');
  }
});

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
  if (!pdfjsAvailable) {
    throw new Error('PDF.js library not available');
  }

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
certModal.addEventListener('click', e => {
  if (e.target === certModal) closeCertModal();
});

/* ---------- Project (Netflix-style) modal ---------- */
const projectModal = document.getElementById('projectModal');
const projectModalClose = document.getElementById('projectModalClose');
const projectModalBanner = document.getElementById('projectModalBanner');
const projectModalMark = document.getElementById('projectModalMark');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalTags = document.getElementById('projectModalTags');
const projectModalDesc = document.getElementById('projectModalDesc');
const projectModalGithub = document.getElementById('projectModalGithub');

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const title = card.dataset.title;
    const type = card.dataset.type;
    const tags = (card.dataset.tags || '').split(',').map(t => t.trim()).filter(Boolean);
    const desc = card.dataset.desc;
    const github = card.dataset.github;
    const posterClass = [...card.classList].find(c => c.startsWith('poster-'));
    const mark = card.dataset.mark || '';

    projectModalTitle.textContent = title;
    projectModalMark.textContent = mark;
    projectModalBanner.className = 'project-modal-banner ' + posterClass;
    projectModalDesc.textContent = desc;

    projectModalTags.innerHTML = '';

    [type].filter(Boolean).forEach(tag => {
        const span = document.createElement('span');
        span.className = 'project-tag-pill';
        span.textContent = tag;
        projectModalTags.appendChild(span);
        });

        tags.forEach(tag => {
        const pill = document.createElement('span');
        pill.className = 'project-tag-pill';

        const icon = techIcons[tag];

        if (icon) {
            pill.innerHTML = `<i class="${icon}"></i> ${tag}`;
        } else {
            pill.textContent = tag;
        }

        projectModalTags.appendChild(pill);
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
projectModal.addEventListener('click', e => {
  if (e.target === projectModal) closeProjectModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (certModal.classList.contains('open')) closeCertModal();
    if (projectModal.classList.contains('open')) closeProjectModal();
  }
});

/* ============================================================
   TECH STACK DOCK — simplified hover + click behavior
   - Click a tech icon to scroll to the matching project.
   - Tooltips still appear on hover/focus.
   - The animated magnification behavior is disabled.
   ============================================================ */
(function initTechDock() {
  const dock = document.getElementById('techDock');
  if (!dock) return;

  const items = Array.from(dock.querySelectorAll('.dock-item'));
  if (!items.length) return;

  const projectCards = Array.from(document.querySelectorAll('.project-card'));

  // Exact-tag-token matching used by the click highlight, so "Java"
  // never lights up "JavaScript" (substring matching used to do this).
  function getMatches(item) {
    const keywords = (item.dataset.match || item.dataset.tech || '')
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(Boolean);

    return projectCards.filter(card => {
      const tagSet = new Set(
        (card.dataset.tags || '').toLowerCase().split(',').map(t => t.trim()).filter(Boolean)
      );
      return keywords.some(k => tagSet.has(k));
    });
  }

  const MAX_SCALE = 1.7;   // scale of the icon directly under the cursor
  const MIN_SCALE = 1;     // resting scale
  const INFLUENCE = 110;   // px radius on each side of the cursor that reacts
  const LIFT = 16;         // px the peak icon rises above the dock
  const EASE = 0.22;       // 0–1: how fast current scale chases target scale

  let mouseX = null;
  let rafId = null;
  let magnifyEnabled = false;

  // Per-icon animation state, kept in a plain array (index-matched to `items`)
  const state = items.map(() => ({ scale: MIN_SCALE, target: MIN_SCALE }));

  function isDesktopPointer() {
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    return hasFinePointer && window.innerWidth > 640;
  }

  const DOCK_MAX_WIDTH = 720; // must match .tech-dock's CSS max-width

  /* Shrink --dock-size just enough that all icons fit the dock's own
     capped width with no horizontal scrolling. Only runs on desktop —
     mobile already wraps to a grid via the existing media query,
     which needs the default sizes. */
  function fitDockSize() {
    if (!magnifyEnabled) {
      dock.style.removeProperty('--dock-size');
      return;
    }
    const available = Math.min(dock.parentElement.clientWidth, DOCK_MAX_WIDTH);
    const gap = 10;
    const paddingX = 44; // matches .tech-dock's left+right padding
    const raw = (available - paddingX - (items.length - 1) * gap) / items.length;
    const size = Math.max(30, Math.min(46, raw));
    dock.style.setProperty('--dock-size', size.toFixed(1) + 'px');
  }

  function updateTargets() {
    if (mouseX === null || !magnifyEnabled) {
      state.forEach(s => { s.target = MIN_SCALE; });
      return;
    }
    items.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const distance = Math.min(Math.abs(mouseX - centerX), INFLUENCE);
      const t = distance / INFLUENCE;                 // 0 = under cursor, 1 = out of range
      const eased = (Math.cos(t * Math.PI) + 1) / 2;   // smooth cosine falloff curve
      state[i].target = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * eased;
    });
  }

  function tick() {
    updateTargets();

    let stillMoving = false;
    items.forEach((item, i) => {
      const s = state[i];
      s.scale += (s.target - s.scale) * EASE;

      if (Math.abs(s.target - s.scale) > 0.001) {
        stillMoving = true;
      } else {
        s.scale = s.target;
      }

      const liftAmount = ((s.scale - MIN_SCALE) / (MAX_SCALE - MIN_SCALE)) * LIFT;
      item.style.transform = `translateY(${-liftAmount}px) scale(${s.scale.toFixed(3)})`;
    });

    rafId = stillMoving ? requestAnimationFrame(tick) : null;
  }

  function requestTick() {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }

  function handleMove(e) {
    if (!magnifyEnabled) return;
    mouseX = e.clientX;
    requestTick();
  }

  function handleLeave() {
    mouseX = null;
    requestTick(); // let the loop ease everything back to rest, then it stops itself
  }

  function resetTransforms() {
    items.forEach((item, i) => {
      state[i].scale = MIN_SCALE;
      state[i].target = MIN_SCALE;
      item.style.transform = '';
    });
  }

  function applyMode() {
    magnifyEnabled = isDesktopPointer();
    if (!magnifyEnabled) {
      mouseX = null;
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      resetTransforms();
    }
    fitDockSize();
  }

  dock.addEventListener('mousemove', handleMove);
  dock.addEventListener('mouseleave', handleLeave);
  window.addEventListener('resize', applyMode);
  applyMode();

  /* ---------- Tooltip: fades in above whichever icon is hovered/focused ---------- */
  items.forEach(item => {
    const show = () => item.classList.add('tooltip-visible');
    const hide = () => item.classList.remove('tooltip-visible');
    item.addEventListener('mouseenter', show);
    item.addEventListener('mouseleave', hide);
    item.addEventListener('focus', show);
    item.addEventListener('blur', hide);
    // Touch devices: a tap shows the tooltip briefly without blocking the click.
    item.addEventListener('touchstart', () => {
      show();
      setTimeout(hide, 900);
    }, { passive: true });
  });

  /* ---------- Click: scroll to matching project(s), highlight ALL of
     them, dim the rest, and fade the whole selection back to normal
     after ~4s. A shared timer means clicking a different icon before
     the previous fade finishes just restarts the window cleanly. ---------- */
  const DIM_DURATION = 4000; // ms before the highlight/dim clears
  let dimTimer = null;

  function clearDockSelection() {
    projectCards.forEach(card => {
      card.classList.remove('dock-highlight', 'dock-dim');
    });
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const link = item.dataset.link;
      if (link) {
        window.open(link, '_blank', 'noopener');
        return;
      }

      const matches = getMatches(item);
      const target = matches[0] || document.getElementById('projects');
      if (!target) return;

      target.scrollIntoView({ behavior: 'smooth', block: matches.length ? 'center' : 'start' });

      if (dimTimer !== null) {
        clearTimeout(dimTimer);
        dimTimer = null;
      }
      clearDockSelection();

      if (matches.length) {
        projectCards.forEach(card => {
          if (matches.includes(card)) {
            card.classList.add('dock-highlight');
          } else {
            card.classList.add('dock-dim');
          }
        });

        dimTimer = setTimeout(() => {
          clearDockSelection();
          dimTimer = null;
        }, DIM_DURATION);
      }
    });
  });
})();
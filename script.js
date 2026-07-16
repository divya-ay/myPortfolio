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
    const year = card.dataset.year;
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
projectModal.addEventListener('click', e => {
  if (e.target === projectModal) closeProjectModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (certModal.classList.contains('open')) closeCertModal();
    if (projectModal.classList.contains('open')) closeProjectModal();
  }
});
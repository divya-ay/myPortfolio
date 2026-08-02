/* ============================================================
   CARD COMPONENTS
   ============================================================
   Small "component" functions that build a single project card
   or certificate card element from a plain data object. Kept
   separate from render.js so the *shape* of a card (this file)
   is decoupled from *which data gets rendered where* (render.js).

   These produce exactly the same DOM/attributes/classes that used
   to be hand-written in index.html, so the existing CSS in
   style.css and the existing event listeners in script.js (which
   just do document.querySelectorAll('.project-card') / '.cert-card')
   keep working unchanged.
   ============================================================ */

/* The two footer "person" icons used on project cards, copied
   verbatim from the original hand-written markup. */
const PERSON_ICON_SVG = {
  team: '<svg width="16" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  solo: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>'
};

/**
 * Build one .project-card button element from a project data object.
 * @param {object} project - see js/data/projects-data.js for fields
 * @param {number} index - position in the array (0-based)
 */
function createProjectCard(project, index) {
  const card = document.createElement('button');
  card.className = `project-card poster-${index + 1}`;

  card.dataset.mark = project.mark;
  card.dataset.img = project.img || '';
  card.dataset.title = project.title;
  card.dataset.type = project.type;
  card.dataset.tags = project.tags.join(',');
  card.dataset.desc = project.desc;
  card.dataset.github = project.github;

  const statusLabel = project.status === 'in-progress' ? 'in progress' : project.status;
  const cardTitle = project.cardTitle || project.title;

  const iconsHTML = project.icons
    .map(name => `<i class="${window.TECH_ICONS[name] || ''}"></i>`)
    .join('\n              ');

  const personSVG = PERSON_ICON_SVG[project.personIcon] || PERSON_ICON_SVG.team;

  card.innerHTML = `
      <span class="project-card-mark">${project.mark}</span>
      <div class="project-card-shade"></div>
      <div class="project-card-overlay">
        <div class="project-card-top">
          <h3>${cardTitle}</h3>
          <span class="status-pill ${project.status}">${statusLabel}</span>
        </div>
        <p class="project-card-desc">${project.cardDesc}</p>
        <div class="project-card-footer">
          <div class="tech-chips">
              ${iconsHTML}
          </div>
          <span class="card-person-icon" aria-hidden="true">
            ${personSVG}
          </span>
        </div>
      </div>
    `;

  return card;
}

/**
 * Build one .cert-card button element from a certificate data object.
 * @param {object} cert - see js/data/certificates-data.js for fields
 * @param {number} index - position in the array (0-based)
 */
function createCertCard(cert, index) {
  const card = document.createElement('button');
  card.className = `poster-card cert-card cert-${index + 1}`;

  card.dataset.title = cert.title;
  card.dataset.subtitle = cert.subtitle;
  card.dataset.tags = cert.tags.join(',');
  card.dataset.type = cert.type;
  card.dataset.img = cert.img;
  card.dataset.src = cert.src;

  const cardTitle = cert.cardTitle || cert.title;
  const cardSub = cert.cardSub || cert.subtitle;

  card.innerHTML = `
      <div class="poster-art">
        <span class="poster-mark">${cert.mark}</span>
      </div>
      <div class="poster-shade"></div>
      <div class="poster-label">
        <h3>${cardTitle}</h3>
        <span class="poster-sub">${cardSub}</span>
      </div>
    `;

  return card;
}

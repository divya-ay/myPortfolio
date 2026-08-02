/* ============================================================
   RENDER
   ============================================================
   Reads the data files (window.PROJECTS_DATA / window.CERTIFICATES_DATA)
   and appends the generated cards into the same grid containers
   that used to hold hand-written HTML. Runs as a plain synchronous
   script, placed after the data/component scripts but BEFORE
   script.js, so that by the time script.js runs and does its
   document.querySelectorAll('.project-card' / '.cert-card'), the
   cards already exist in the DOM exactly as before.
   ============================================================ */
(function renderCards() {
  const projectGrid = document.querySelector('.project-card-grid');
  if (projectGrid && Array.isArray(window.PROJECTS_DATA)) {
    window.PROJECTS_DATA.forEach((project, index) => {
      projectGrid.appendChild(createProjectCard(project, index));
    });
  }

  const certGrid = document.querySelector('.cert-poster-grid');
  if (certGrid && Array.isArray(window.CERTIFICATES_DATA)) {
    window.CERTIFICATES_DATA.forEach((cert, index) => {
      certGrid.appendChild(createCertCard(cert, index));
    });
  }
})();

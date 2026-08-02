/* ============================================================
   TECH ICON MAP
   ============================================================
   Single source of truth mapping a technology's display name to
   its Devicon icon class. Used by:
     - js/components/cards.js   (project card footer chips)
     - script.js                (project modal tag icons)
   Previously this object was duplicated only in script.js; moving
   it here means both places always agree on which icon a given
   tech name renders as.
   ============================================================ */
window.TECH_ICONS = {
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

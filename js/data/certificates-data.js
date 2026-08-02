/* ============================================================
   CERTIFICATES DATA
   ============================================================
   Each object here becomes one card in the "Learning and
   development" grid and feeds the certificate preview modal.
   To add a new certificate, add another object to this array —
   js/components/cards.js takes care of turning it into the same
   markup the cards already use.

   Field reference:
     mark        - short monogram shown on the poster / modal banner
     title       - full name, used in the modal and data-title
     cardTitle   - optional shorter name shown on the card itself
                   (falls back to `title` if omitted)
     subtitle    - full subtitle shown in the modal
     cardSub     - optional shorter subtitle shown on the card
                   (falls back to `subtitle` if omitted)
     tags        - keyword list shown as tag pills in the modal
     type        - "pdf" | "image" -> which preview renderer to use
     img         - cover art (svg/png/etc.) shown on the poster card
     src         - path to the actual certificate file to preview
   ============================================================ */
window.CERTIFICATES_DATA = [
  {
    mark: "N",
    title: "CCNA: Introduction to Networks",
    cardTitle: "Introduction to Networks",
    subtitle: "Cisco Networking Academy · 2025/26",
    cardSub: "Cisco Networking Academy",
    tags: ["Networking", "CCNA"],
    type: "pdf",
    img: "certs/cert-1-networks.svg",
    src: "certificates/itn.pdf"
  },
  {
    mark: "CS",
    title: "CCNA: Introduction to Cybersecurity",
    cardTitle: "Introduction to Cybersecurity",
    subtitle: "Cisco Networking Academy · 2025/26",
    cardSub: "Cisco Networking Academy",
    tags: ["Security", "CCNA"],
    type: "pdf",
    img: "certs/cert-2-cybersecurity.svg",
    src: "certificates/Introduction_to_Cybersecurity_certificate.pdf"
  },
  {
    mark: "DA",
    title: "Deloitte: Data Analytics and Job Simulation",
    cardTitle: "Data Analytics Job Simulation",
    subtitle: "Certificate of completion",
    cardSub: "Deloitte",
    tags: ["Data Analytics", "Deloitte"],
    type: "pdf",
    img: "certs/cert-3-data-analytics.svg",
    src: "certificates/DataAnalyticsJobSimulationDeloitte.pdf"
  },
  {
    mark: "ME",
    title: "MathE Project Collaboration",
    subtitle: "MathE Project Collaboration · 2025",
    cardSub: "MathE · 2025",
    tags: ["Collaboration", "MathE"],
    type: "image",
    img: "certs/cert-4-mathe.svg",
    src: "certificates/MathE.jpg"
  }
];

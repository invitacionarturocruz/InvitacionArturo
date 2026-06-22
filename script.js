// ============ COUNTDOWN ============
const TARGET = new Date('2026-07-18T20:00:00-06:00').getTime();
const cd = document.getElementById('countdown');
function tick() {
  const diff = Math.max(0, TARGET - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const map = { d, h, m, s };
  cd.querySelectorAll('.cd-num').forEach(el => {
    el.textContent = String(map[el.dataset.k]).padStart(2, '0');
  });
}
tick();
setInterval(tick, 1000);

// ============ SCROLL REVEAL ============
const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .cd-box';

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

// Observar todos los elementos al cargar
function initReveal() {
  document.querySelectorAll(revealSelectors).forEach(el => {
    observer.observe(el);
  });
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReveal);
} else {
  initReveal();
}

// ============ RSVP → Google Sheets ============
// 🔧 Reemplaza esta URL con tu Google Apps Script Web App URL.
// 1. Crea un Google Sheet con columnas: timestamp, nombre, asistencia, invitados, mensaje
// 2. Extensiones → Apps Script. Pega un doPost(e) que escriba e.parameter al sheet.
// 3. Deploy → Web app → Anyone. Copia la URL aquí abajo.
const SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxXJY4BNZuf3sxnjzwFU-R7MyTg4Nm9P8rHA2lyIcp1icBmq7gijQ42Hec89nZdEQsS2w/exec";

const form = document.getElementById('rsvp-form');
const success = document.getElementById('rsvp-success');
const submitBtn = document.getElementById('rsvp-submit');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';
  try {
    const data = new FormData(form);
    const params = new URLSearchParams(data);          // ← cambio clave
    await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
  } catch (_) { /* no-cors: ignore */ }
  form.hidden = true;
  success.hidden = false;
});

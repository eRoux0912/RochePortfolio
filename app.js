const root = document.documentElement;
const toggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  toggle.textContent = theme === 'dark' ? '☀' : '☾';
  toggle.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  );
}

let saved = null;
try {
  saved = localStorage.getItem('theme');
} catch (e) {}

applyTheme(saved || 'dark');

toggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem('theme', next);
  } catch (e) {}
});

// contact form

const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.className = 'form-status mono mt-3 mb-0';
  statusEl.textContent = 'Sending...';

  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString(),
    });

    if (!response.ok) throw new Error('Submit failed');

    statusEl.classList.add('is-success');
    statusEl.textContent = "Message sent. I'll get back to you soon.";
    form.reset();
  } catch (err) {
    statusEl.classList.add('is-error');
    statusEl.textContent = 'Something went wrong. Please try again.';
  }
});

// ruler JS 

// scroll ruler

const rulerPercent = document.getElementById('rulerPercent');
const rulerSection = document.getElementById('rulerSection');

function updateRuler() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  root.style.setProperty('--scroll', progress);
  rulerPercent.textContent = String(Math.round(progress * 100)).padStart(3, '0') + '%';
}

window.addEventListener('scroll', updateRuler, { passive: true });
window.addEventListener('resize', updateRuler);
updateRuler();

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        rulerSection.textContent = entry.target.querySelector('.mono').textContent;
      }
    });
  },
  { rootMargin: '-45% 0px -45% 0px' }
);

document.querySelectorAll('main section').forEach((section) => {
  sectionObserver.observe(section);
});
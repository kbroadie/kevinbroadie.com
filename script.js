// Address the contact form's email draft is sent to.
// TODO: set this to the real inbox before deploying.
const CONTACT_EMAIL = 'hello@example.com';

// Footer year
document.getElementById('yr').textContent = new Date().getFullYear();

// Fade sections in as they scroll into view
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in'));
}

// Dim the "How did you hear" select while it shows its placeholder
const hear = document.getElementById('hear');
const syncHear = () => { hear.style.color = hear.value ? '' : 'var(--faint)'; };
hear.addEventListener('change', syncHear);
syncHear();

// Contact form: validate, then open a pre-filled email draft
const form = document.getElementById('form');
const success = document.getElementById('success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  const field = (key) => (data.get(key) || '').trim();
  const name = field('name');
  const company = field('company');

  const lines = [field('msg'), '', '—', `Name: ${name}`];
  if (company) lines.push(`Company: ${company}`);
  lines.push(`Email: ${field('email')}`);
  if (field('phone')) lines.push(`Phone: ${field('phone')}`);
  if (field('hear')) lines.push(`Heard about us via: ${field('hear')}`);

  const subject = `New project — ${name}${company ? ` (${company})` : ''}`;
  window.location.href = `mailto:${CONTACT_EMAIL}`
    + `?subject=${encodeURIComponent(subject)}`
    + `&body=${encodeURIComponent(lines.join('\n'))}`;

  form.style.display = 'none';
  success.classList.add('show');
});

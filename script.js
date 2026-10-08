// Where contact form messages go.
// Placeholder on purpose: the real address is set only on the live web host.
const CONTACT_EMAIL = 'hello@example.com';
// Optional: a form service endpoint (e.g. 'https://formspree.io/f/abcdwxyz').
// When set, the form sends directly instead of opening the visitor's email app.
const FORM_ENDPOINT = '';

// Footer year
document.getElementById('yr').textContent = new Date().getFullYear();

// Fade content in as it scrolls into view
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in'));
}

// Phone menu
const menuButton = document.querySelector('.menu-btn');
const header = document.querySelector('.site-header');
const setMenu = (open) => {
  header.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Close' : 'Menu';
};
menuButton.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && header.classList.contains('menu-open')) {
    setMenu(false);
    menuButton.focus();
  }
});

// Links like contact.html?interest=An+audit pre-select the matching form options
const params = new URLSearchParams(window.location.search);
['interest', 'role'].forEach((key) => {
  const select = document.getElementById(key);
  const value = params.get(key);
  if (select && value && [...select.options].some((option) => option.value === value)) {
    select.value = value;
  }
});

// Contact form
const form = document.getElementById('form');
const success = document.getElementById('success');
const errorBox = document.getElementById('form-error');

if (form && FORM_ENDPOINT) {
  document.getElementById('form-note').textContent = 'Sent straight to us, in confidence.';
}

const showSuccess = (title, text) => {
  document.getElementById('success-title').textContent = title;
  document.getElementById('success-text').textContent = text;
  form.hidden = true;
  success.hidden = false;
  success.focus();
};

const buildMessage = (data) => {
  const field = (key) => (data.get(key) || '').trim();
  const name = field('name');
  const company = field('company');

  const lines = [field('msg'), '', '—', `Name: ${name}`];
  if (company) lines.push(`Company: ${company}`);
  lines.push(`Email: ${field('email')}`);
  if (field('phone')) lines.push(`Phone: ${field('phone')}`);
  lines.push(`They are: ${field('role')}`);
  lines.push(`Interested in: ${field('interest')}`);
  if (field('budget')) lines.push(`Budget: ${field('budget')}`);
  if (field('timeline')) lines.push(`Timeline: ${field('timeline')}`);
  if (field('hear')) lines.push(`Heard about us via: ${field('hear')}`);

  const subject = `${field('interest')} — ${name}${company ? ` (${company})` : ''}`;
  return { subject, body: lines.join('\n') };
};

const openEmailDraft = ({ subject, body }) => {
  window.location.href = `mailto:${CONTACT_EMAIL}`
    + `?subject=${encodeURIComponent(subject)}`
    + `&body=${encodeURIComponent(body)}`;
};

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.hidden = true;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const message = buildMessage(new FormData(form));

  if (!FORM_ENDPOINT) {
    openEmailDraft(message);
    showSuccess('Message ready', 'Your email app should open with everything filled in, ready for you to send.');
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const data = new FormData(form);
    data.append('_subject', message.subject);
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    showSuccess('Thank you', 'Your message is with us. We will be in touch soon.');
  } catch {
    errorBox.textContent = 'Something went wrong sending your message. Opening your email app instead.';
    errorBox.hidden = false;
    openEmailDraft(message);
  } finally {
    button.disabled = false;
  }
});

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


const header = document.querySelector('.site-header');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Header tightens once the page scrolls
let scrollTick = false;
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 8);
  scrollTick = false;
};
window.addEventListener('scroll', () => {
  if (!scrollTick) {
    scrollTick = true;
    requestAnimationFrame(onScroll);
  }
}, { passive: true });
onScroll();

// Color theme: Auto follows the system; Light and Dark are remembered
const THEME_KEY = 'kbcs-theme';
const themeColors = { light: '#f3f1ec', dark: '#0e0e12' };
const themeMetas = [...document.querySelectorAll('meta[name="theme-color"]')];
const applyTheme = (choice) => {
  const forced = choice === 'light' || choice === 'dark';
  if (forced) document.documentElement.setAttribute('data-theme', choice);
  else document.documentElement.removeAttribute('data-theme');
  themeMetas.forEach((meta) => {
    const own = meta.media.includes('dark') ? themeColors.dark : themeColors.light;
    meta.content = forced ? themeColors[choice] : own;
  });
  document.querySelectorAll('[data-theme-choice]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.themeChoice === (forced ? choice : 'auto')));
  });
};
let storedTheme = null;
try { storedTheme = localStorage.getItem(THEME_KEY); } catch { /* storage blocked */ }
applyTheme(storedTheme);
document.querySelectorAll('[data-theme-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    const choice = button.dataset.themeChoice;
    try {
      if (choice === 'auto') localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, choice);
    } catch { /* storage blocked: the choice lasts for this page only */ }
    applyTheme(choice);
  });
});

// Sheets (dialogs): close with the X, the backdrop, or Escape
const openSheet = (dialog, opener) => {
  if (!dialog || dialog.open) return;
  dialog.showModal();
  if (opener?.hasAttribute('aria-expanded')) {
    opener.setAttribute('aria-expanded', 'true');
    dialog.addEventListener('close', () => opener.setAttribute('aria-expanded', 'false'), { once: true });
  }
};
document.querySelectorAll('dialog.sheet').forEach((dialog) => {
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
  });
});

// "More" tab on phones
const moreButton = document.querySelector('.tab-more');
if (moreButton) {
  moreButton.setAttribute('aria-expanded', 'false');
  moreButton.addEventListener('click', () => openSheet(document.getElementById('more-sheet'), moreButton));
}

// Client logo marquee: sits still when it fits, and can be paused
const logos = document.querySelector('.logos');
if (logos) {
  const marquee = logos.querySelector('.marquee');
  const track = logos.querySelector('.marquee-track');
  const toggle = logos.querySelector('.marquee-toggle');
  const fit = () => {
    logos.classList.remove('static');
    logos.classList.toggle('static', track.scrollWidth <= marquee.clientWidth);
  };
  fit();
  window.addEventListener('resize', fit, { passive: true });
  toggle.addEventListener('click', () => {
    const paused = !logos.classList.contains('paused');
    logos.classList.toggle('paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
  });
}

// Work: filter projects by industry
const chips = document.querySelectorAll('.chip[data-filter]');
const filterStatus = document.getElementById('filter-status');
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    let shown = 0;
    document.querySelectorAll('#project-grid .project').forEach((item) => {
      const match = filter === 'all' || item.dataset.industry === filter;
      item.hidden = !match;
      if (match) {
        shown += 1;
        item.classList.add('in');
      }
    });
    const noun = shown === 1 ? 'project' : 'projects';
    filterStatus.textContent = filter === 'all'
      ? `Showing all ${shown} ${noun}`
      : `Showing ${shown} ${noun} in ${chip.textContent.trim()}`;
  });
});

// Work: project sheets with an image carousel; work.html#grounded opens one directly
const setupCarousel = (carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const slides = [...track.children];
  const count = carousel.querySelector('.carousel-count');
  const [prev, next] = carousel.querySelectorAll('.carousel-btn');
  let current = -1;
  const step = () => (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth) || 1;
  const update = () => {
    const index = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / step())));
    if (index === current) return;
    current = index;
    count.textContent = `${current + 1} of ${slides.length}`;
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
  };
  const go = (dir) => {
    const index = Math.max(0, Math.min(slides.length - 1, current + dir));
    track.scrollTo({ left: index * step(), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  return () => {
    track.scrollLeft = 0;
    current = -1;
    update();
  };
};

const projectSheets = {};
document.querySelectorAll('.project-sheet').forEach((dialog) => {
  const key = dialog.id.replace(/^sheet-/, '');
  const carousel = dialog.querySelector('.carousel');
  projectSheets[key] = { dialog, reset: carousel ? setupCarousel(carousel) : () => {} };
  dialog.addEventListener('close', () => {
    if (window.location.hash === `#${key}`) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  });
});
const openProject = (key) => {
  const sheet = projectSheets[key];
  if (!sheet) return;
  openSheet(sheet.dialog);
  sheet.reset();
  history.replaceState(null, '', `#${key}`);
};
document.querySelectorAll('.project-open').forEach((button) => {
  button.addEventListener('click', () => openProject(button.dataset.project));
});
openProject(window.location.hash.slice(1));
window.addEventListener('hashchange', () => openProject(window.location.hash.slice(1)));

// Audit: build a request that carries over to the contact form
const builder = document.querySelector('.builder-card');
if (builder) {
  const summary = document.getElementById('builder-summary');
  const updateSummary = () => {
    const picked = [...builder.querySelectorAll('input[name="scope"]:checked')].map((input) => input.value);
    if (!picked.length) summary.textContent = 'Nothing selected yet.';
    else if (picked.length === 1) summary.textContent = `One area: ${picked[0]}.`;
    else summary.textContent = `${picked.length} areas: ${picked.slice(0, -1).join(', ')} and ${picked[picked.length - 1]}.`;
  };
  builder.addEventListener('change', updateSummary);
  updateSummary();
}

// Accessibility: live WCAG contrast checker
const cc = document.getElementById('cc');
if (cc) {
  const fg = document.getElementById('cc-fg');
  const bg = document.getElementById('cc-bg');
  const fgPick = document.getElementById('cc-fg-pick');
  const bgPick = document.getElementById('cc-bg-pick');
  const preview = document.getElementById('cc-preview');
  const ratioOut = document.getElementById('cc-ratio');
  const checks = [...document.querySelectorAll('#cc-checks li')];
  const hint = document.getElementById('cc-hint');
  const live = document.getElementById('cc-live');
  let liveTimer;

  const parseHex = (value) => {
    let hex = value.trim().replace(/^#/, '').toLowerCase();
    if (/^[0-9a-f]{3}$/.test(hex)) hex = [...hex].map((c) => c + c).join('');
    return /^[0-9a-f]{6}$/.test(hex) ? `#${hex}` : null;
  };
  // WCAG 2.1 relative luminance
  const luminance = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  const update = (announce = true) => {
    const f = parseHex(fg.value);
    const b = parseHex(bg.value);
    fg.setAttribute('aria-invalid', String(!f));
    bg.setAttribute('aria-invalid', String(!b));
    hint.classList.toggle('error', !f || !b);
    if (!f || !b) return;
    fgPick.value = f;
    bgPick.value = b;
    preview.style.color = f;
    preview.style.background = b;
    // Round down, as WCAG does: 4.49:1 does not pass 4.5:1
    const ratio = Math.floor(contrast(f, b) * 100) / 100;
    ratioOut.textContent = `${ratio}:1`;
    const results = checks.map((li) => {
      const pass = ratio >= Number(li.dataset.min);
      const badge = li.querySelector('.cc-badge');
      li.dataset.pass = String(pass);
      badge.textContent = pass ? 'Pass' : 'Fail';
      return `${li.textContent.slice(badge.textContent.length).trim()}: ${pass ? 'passes' : 'fails'}`;
    });
    clearTimeout(liveTimer);
    if (announce) {
      liveTimer = setTimeout(() => {
        live.textContent = `Contrast ${ratio} to 1. ${results.join('. ')}.`;
      }, 600);
    }
  };

  fg.addEventListener('input', () => update());
  bg.addEventListener('input', () => update());
  fgPick.addEventListener('input', () => { fg.value = fgPick.value; update(); });
  bgPick.addEventListener('input', () => { bg.value = bgPick.value; update(); });
  document.getElementById('cc-swap').addEventListener('click', () => {
    [fg.value, bg.value] = [bg.value, fg.value];
    update();
  });
  cc.addEventListener('submit', (e) => e.preventDefault());
  update(false);
}

// Links like contact.html?interest=An+audit pre-select the matching choices,
// and the areas picked in the audit builder start the message
const params = new URLSearchParams(window.location.search);
['interest', 'role'].forEach((key) => {
  const value = params.get(key);
  const radio = [...document.querySelectorAll(`#form input[name="${key}"]`)].find((input) => input.value === value);
  if (radio) radio.checked = true;
});
const scope = params.getAll('scope').filter(Boolean);
const msgBox = document.getElementById('msg');
if (msgBox && scope.length && !msgBox.value) {
  msgBox.value = `Audit scope: ${scope.join(', ')}.\n\n`;
}

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

form?.addEventListener('change', (e) => {
  if (e.target.type === 'radio') e.target.closest('.pills')?.classList.remove('invalid');
});

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.hidden = true;
  form.querySelectorAll('.pills').forEach((group) => {
    const required = group.querySelector('input[required]');
    group.classList.toggle('invalid', Boolean(required) && !group.querySelector('input:checked'));
  });
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

// Works offline and can be added to the home screen where supported
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(window.location.hostname))) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

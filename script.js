// Where contact form messages go
const CONTACT_EMAIL = 'kbroadie+kbcs@gmail.com';
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

// Services: pairwise survey demo. Each pair is asked once; wins decide the ranking.
const pw = document.getElementById('pw');
if (pw) {
  const OPTIONS = ['Safer crossings', 'Shade trees', 'Protected bike lanes', 'More frequent buses', 'Smoother pavement'];
  const ask = document.getElementById('pw-ask');
  const result = document.getElementById('pw-result');
  const progress = document.getElementById('pw-progress');
  const bar = document.getElementById('pw-bar');
  const rank = document.getElementById('pw-rank');
  const live = document.getElementById('pw-live');
  const choices = [...pw.querySelectorAll('.pw-choice')];
  let pairs = [];
  let step = 0;
  let wins = [];
  let beat = [];

  const shuffle = (list) => {
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };
  const show = () => {
    const [a, b] = pairs[step];
    choices[0].textContent = OPTIONS[a];
    choices[1].textContent = OPTIONS[b];
    progress.textContent = `${step + 1} of ${pairs.length}`;
    bar.style.width = `${(step / pairs.length) * 100}%`;
  };
  const finish = () => {
    const order = OPTIONS.map((_, i) => i).sort((x, y) => wins[y] - wins[x] || (beat[x][y] ? -1 : 1));
    rank.replaceChildren(...order.map((i) => {
      const li = document.createElement('li');
      const name = document.createElement('span');
      const meter = document.createElement('span');
      const fill = document.createElement('span');
      name.className = 'pw-name';
      name.textContent = OPTIONS[i];
      meter.className = 'pw-meter';
      meter.setAttribute('aria-hidden', 'true');
      fill.style.width = `${(wins[i] / (OPTIONS.length - 1)) * 100}%`;
      meter.append(fill);
      const count = document.createElement('span');
      count.className = 'pw-wins';
      count.textContent = `${wins[i]} of ${OPTIONS.length - 1}`;
      li.append(name, meter, count);
      return li;
    }));
    progress.textContent = 'Done';
    bar.style.width = '100%';
    ask.hidden = true;
    result.hidden = false;
    result.focus();
  };
  const start = () => {
    pairs = [];
    OPTIONS.forEach((_, i) => OPTIONS.forEach((__, j) => { if (i < j) pairs.push(Math.random() < 0.5 ? [i, j] : [j, i]); }));
    shuffle(pairs);
    step = 0;
    wins = OPTIONS.map(() => 0);
    beat = OPTIONS.map(() => OPTIONS.map(() => false));
    ask.hidden = false;
    result.hidden = true;
    show();
  };
  choices.forEach((button, side) => {
    button.addEventListener('click', () => {
      const winner = pairs[step][side];
      const loser = pairs[step][1 - side];
      wins[winner] += 1;
      beat[winner][loser] = true;
      step += 1;
      if (step < pairs.length) {
        show();
        live.textContent = `Question ${step + 1} of ${pairs.length}: ${choices[0].textContent} or ${choices[1].textContent}?`;
      } else {
        finish();
      }
    });
  });
  document.getElementById('pw-restart').addEventListener('click', () => {
    start();
    choices[0].focus();
  });
  start();
}

// Phones: swipe sideways to move between sections, in tab bar order
const SECTIONS = ['index.html', 'services.html', 'audit.html', 'work.html', 'accessibility.html', 'about.html', 'contact.html'];
const SECTION_NAMES = ['Home', 'Services', 'Audit', 'Work', 'Accessibility', 'About', 'Contact'];
const here = SECTIONS.indexOf(window.location.pathname.split('/').pop() || 'index.html');
const coarse = window.matchMedia('(pointer: coarse)');
if (here !== -1 && 'ontouchstart' in window) {
  const NO_SWIPE = 'input, textarea, select, label, .carousel-track, .chips, .pw, .cc, dialog, [data-no-swipe]';
  const EDGE = 24;
  const main = document.getElementById('main');
  const hint = document.createElement('div');
  hint.className = 'swipe-hint';
  hint.setAttribute('aria-hidden', 'true');
  document.body.append(hint);
  let start = null;
  let locked = false;
  let dx = 0;

  const targetFor = (delta) => {
    const index = here + (delta < 0 ? 1 : -1);
    return index >= 0 && index < SECTIONS.length ? index : -1;
  };
  const reset = () => {
    main.style.transform = '';
    main.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    hint.classList.remove('show', 'ready');
    start = null;
    locked = false;
    dx = 0;
  };

  document.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    if (e.touches.length !== 1 || !coarse.matches || t.clientX < EDGE || t.clientX > window.innerWidth - EDGE) return;
    if (e.target.closest(NO_SWIPE) || document.querySelector('dialog[open]')) return;
    start = { x: t.clientX, y: t.clientY, time: e.timeStamp };
    main.style.transition = 'none';
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!start) return;
    const t = e.touches[0];
    dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (!locked) {
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { start = null; return; }
      if (Math.abs(dx) < 16) return;
      locked = true;
    }
    const target = targetFor(dx);
    const pull = target === -1 ? dx * 0.08 : dx * 0.25;
    main.style.transform = `translateX(${Math.max(-60, Math.min(60, pull))}px)`;
    if (target !== -1) {
      hint.textContent = dx < 0 ? `${SECTION_NAMES[target]} →` : `← ${SECTION_NAMES[target]}`;
      hint.dataset.side = dx < 0 ? 'right' : 'left';
      hint.classList.add('show');
      hint.classList.toggle('ready', Math.abs(dx) > 90);
    }
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (!start || !locked) { if (start) reset(); start = null; return; }
    const elapsed = e.timeStamp - start.time;
    const fast = Math.abs(dx) > 50 && Math.abs(dx) / elapsed > 0.5;
    const target = targetFor(dx);
    if (target !== -1 && (Math.abs(dx) > 90 || fast)) {
      try { sessionStorage.setItem('kbcs-swipe', dx < 0 ? 'next' : 'prev'); } catch { /* no transition direction */ }
      window.location.href = SECTIONS[target];
      hint.classList.add('ready');
      return;
    }
    reset();
  }, { passive: true });
  document.addEventListener('touchcancel', reset, { passive: true });
  // Coming back with the browser's back button restores the page as it was left
  window.addEventListener('pageshow', reset);

  // A one-time tip on phones
  let tipped = false;
  try { tipped = localStorage.getItem('kbcs-swipe-tip') === '1'; } catch { tipped = true; }
  if (!tipped && coarse.matches) {
    try { localStorage.setItem('kbcs-swipe-tip', '1'); } catch { /* ignore */ }
    const tip = document.createElement('p');
    tip.className = 'toast';
    tip.setAttribute('role', 'status');
    tip.textContent = 'Tip: swipe sideways to move between sections.';
    document.body.append(tip);
    setTimeout(() => tip.classList.add('show'), 1200);
    setTimeout(() => tip.classList.remove('show'), 5200);
    setTimeout(() => tip.remove(), 6000);
  }
}

// Works offline and can be added to the home screen where supported
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(window.location.hostname))) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

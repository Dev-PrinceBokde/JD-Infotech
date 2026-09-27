/* JD Infotech — site behaviour. No dependencies. */
(() => {
  'use strict';

  const WA_NUMBER = '917405814582';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isMobile = window.matchMedia('(max-width: 767px)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ---------- Missing images: hide gracefully ---------- */
  const hideBroken = (img) => { img.style.visibility = 'hidden'; };
  $$('img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) hideBroken(img);
    img.addEventListener('error', () => hideBroken(img), { once: true });
  });

  /* ---------- WhatsApp deep links ---------- */
  const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  $$('[data-wa]').forEach((a) => {
    a.href = waLink(`Namaste JD Infotech, I'd like to enquire about ${a.dataset.wa}.`);
  });

  /* ---------- Header + scroll progress ---------- */
  const header = $('.hdr');
  const progress = $('.progress');
  const onScrollUI = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 30);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--sp', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
  };

  /* ---------- Mobile menu ---------- */
  const burger = $('.burger');
  const menu = $('#menu');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    if (open) $('a', menu).focus({ preventScroll: true });
  };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (!document.body.classList.contains('menu-open')) return;
    if (e.key === 'Escape') { setMenu(false); burger.focus(); }
    if (e.key === 'Tab') {
      const items = [burger, ...$$('a', menu)];
      const i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => e.matches && setMenu(false));

  /* ---------- Active nav link ---------- */
  const navLinks = $$('.hdr__nav a');
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${en.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean).forEach((t) => navIO.observe(t));

  /* ---------- Reveal on scroll (staggered per parent) ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      revealIO.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  const groups = new Map();
  $$('[data-reveal]').forEach((el) => {
    const p = el.parentElement;
    const n = groups.get(p) || 0;
    el.style.setProperty('--d', `${Math.min(n, 8) * 70}ms`);
    groups.set(p, n + 1);
    revealIO.observe(el);
  });

  /* ---------- Parallax ---------- */
  const pxEls = $$('[data-speed]');
  let ticking = false;
  const runParallax = () => {
    const vh = window.innerHeight;
    const on = !reduceMotion.matches && !isMobile.matches;
    pxEls.forEach((el) => {
      if (!on) { el.style.transform = ''; return; }
      const host = el.parentElement.getBoundingClientRect();
      if (host.bottom < -200 || host.top > vh + 200) return;
      const y = (host.top + host.height / 2 - vh / 2) * -(parseFloat(el.dataset.speed) || 0);
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    });
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; onScrollUI(); runParallax(); });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScrollUI(); runParallax();

  /* ---------- Glass spotlight + 3D tilt (desktop pointers only) ---------- */
  if (finePointer.matches) {
    $$('[data-spot]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
    $$('[data-tilt]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        if (reduceMotion.matches) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
      });
      el.addEventListener('pointerleave', () => { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); });
    });
  }

  /* ---------- Clocks (IST) ---------- */
  const fmtDate = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' });
  const fmtTime = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const clocks = $$('[data-clock]');
  const shortClocks = $$('[data-clock-short]');
  const tick = () => {
    const now = new Date();
    const t = fmtTime.format(now);
    clocks.forEach((c) => { c.textContent = `${fmtDate.format(now)} · ${t} IST`; });
    shortClocks.forEach((c) => { c.textContent = `${t} IST`; });
  };
  tick();
  setInterval(tick, 1000);
  const dateEl = $('[data-date]');
  if (dateEl) dateEl.textContent = fmtDate.format(new Date());
  $$('[data-year]').forEach((y) => { y.textContent = new Date().getFullYear(); });

  /* ---------- Count-up ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      countIO.unobserve(en.target);
      const el = en.target;
      const to = parseInt(el.dataset.count, 10);
      if (reduceMotion.matches) { el.textContent = to; return; }
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 1200);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 4)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countIO.observe(el));

  /* ---------- Hero console: video + motion toasts ---------- */
  const feedVideo = $('.feed__v');
  if (feedVideo) {
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !reduceMotion.matches) feedVideo.play().catch(() => {});
      else feedVideo.pause();
    }).observe(feedVideo);
    if (reduceMotion.matches) feedVideo.pause();
  }

  const toast = $('.toast');
  const toastText = $('[data-toast]');
  if (toast && toastText && !reduceMotion.matches) {
    const events = [
      'CAM 01 · Main gate · just now',
      'CAM 02 · Parking · 2 sec ago',
      'CAM 04 · Society road · just now',
      'CAM 03 · Office · 1 sec ago',
    ];
    let i = 0;
    setInterval(() => {
      toast.classList.add('is-out');
      setTimeout(() => {
        i = (i + 1) % events.length;
        toastText.textContent = events[i];
        toast.classList.remove('is-out');
      }, 650);
    }, 4800);
  }

  /* ---------- Showcase player ---------- */
  const player = $('.player');
  if (player) {
    const video = $('.player__video', player);
    const tabs = $$('.seg__b');
    const glow = $('.seg__glow');
    const playBtn = $('[data-play]', player);
    const muteBtn = $('[data-mute]', player);
    const bar = $('[data-progress]', player);
    const camLabel = $('[data-cam-label]', player);
    const desc = $('[data-desc]', player);
    let loaded = false;
    let userPaused = false;
    let active = tabs[0];

    const moveGlow = () => {
      if (!glow || !active) return;
      glow.style.left = `${active.offsetLeft}px`;
      glow.style.width = `${active.offsetWidth}px`;
    };
    const setIcon = (btn, id) => $('use', btn).setAttribute('href', `#${id}`);
    const syncPlayUI = () => {
      const playing = !video.paused;
      setIcon(playBtn, playing ? 'i-pause' : 'i-play');
      playBtn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
    };
    const tryPlay = () => { if (!userPaused && !reduceMotion.matches) video.play().catch(() => {}); };

    const load = (tab) => {
      const first = !loaded;
      active = tab;
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      moveGlow();
      camLabel.textContent = tab.dataset.cam;
      desc.textContent = tab.dataset.desc;
      bar.style.width = '0%';
      player.classList.add('is-switching');
      setTimeout(() => {
        video.poster = tab.dataset.poster;
        video.src = tab.dataset.src;
        video.load();
        tryPlay();
        player.classList.remove('is-switching');
      }, first ? 0 : 280);
      loaded = true;
    };

    tabs.forEach((t) => t.addEventListener('click', () => {
      if (t === active && loaded) return;
      userPaused = false;
      load(t);
    }));
    playBtn.addEventListener('click', () => {
      if (!loaded) load(active);
      if (video.paused) { userPaused = false; video.play().catch(() => {}); }
      else { userPaused = true; video.pause(); }
    });
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      setIcon(muteBtn, video.muted ? 'i-mute' : 'i-sound');
      muteBtn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
    });
    video.addEventListener('play', syncPlayUI);
    video.addEventListener('pause', syncPlayUI);
    video.addEventListener('timeupdate', () => {
      if (video.duration) bar.style.width = `${((video.currentTime / video.duration) * 100).toFixed(2)}%`;
    });

    new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { if (!loaded) load(active); else tryPlay(); }
      else video.pause();
    }, { threshold: 0.25 }).observe(player);

    window.addEventListener('resize', moveGlow);
    document.fonts && document.fonts.ready.then(moveGlow);
    moveGlow();
    syncPlayUI();
  }

  /* ---------- Floating WhatsApp after the hero ---------- */
  const fab = $('.fab');
  const hero = $('.hero');
  const footBase = $('.footer__base');
  if (fab && hero) {
    let pastHero = false;
    let atFooter = false;
    const sync = () => fab.classList.toggle('is-visible', pastHero && !atFooter);
    new IntersectionObserver(([en]) => { pastHero = !en.isIntersecting; sync(); }, { threshold: 0.05 }).observe(hero);
    if (footBase) new IntersectionObserver(([en]) => { atFooter = en.isIntersecting; sync(); }).observe(footBase);
  }

  /* ---------- Enquiry form → WhatsApp ---------- */
  const form = $('#quote');
  if (form) {
    const status = $('.form__status', form);
    const fail = (field, msg) => {
      field.closest('.field').classList.add('is-invalid');
      status.textContent = msg;
      status.classList.add('is-error');
      field.focus();
    };
    $$('input, textarea, select', form).forEach((f) => f.addEventListener('input', () => {
      f.closest('.field').classList.remove('is-invalid');
      status.textContent = '';
      status.classList.remove('is-error');
    }));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form).entries());
      const name = (d.name || '').trim();
      const phone = (d.phone || '').replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');

      if (name.length < 2) return fail(form.elements.name, 'Please enter your name.');
      if (!/^[6-9]\d{9}$/.test(phone)) return fail(form.elements.phone, 'Please enter a valid 10-digit Indian mobile number.');

      const lines = [
        'Namaste JD Infotech, I have an enquiry:',
        '',
        `Name: ${name}`,
        `Mobile: +91 ${phone}`,
        `Service: ${d.service}`,
        `Property: ${d.type}`,
      ];
      if (d.area && d.area.trim()) lines.push(`Area: ${d.area.trim()}`);
      if (d.message && d.message.trim()) lines.push(`Requirement: ${d.message.trim()}`);

      const url = waLink(lines.join('\n'));
      status.classList.remove('is-error');
      status.textContent = 'Opening WhatsApp… If nothing happens, call +91 74058 14582.';
      // 'noopener' in the features string makes open() return null, so detach manually.
      const w = window.open(url, '_blank');
      if (w) w.opener = null;
      else window.location.href = url;
    });
  }
})();

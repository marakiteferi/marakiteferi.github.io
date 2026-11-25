(() => {
  const root = document.documentElement;
  root.classList.add('js');
  document.getElementById('year').textContent = new Date().getFullYear();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Theme toggle (dark-first) */
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* Nav: scrolled state, mobile menu, active link */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 20);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const menu = document.getElementById('menu');
  const menuBtn = document.getElementById('menu-toggle');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  const links = [...menu.querySelectorAll('a[href^="#"]')];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.hash === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

  /* Entrance animations */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* Project cards: glow follows pointer */
  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* Hero: interconnected-network canvas */
  const c = document.getElementById('net');
  const ctx = c.getContext('2d');
  let W, H, dpr, pts = [], raf, mouse = { x: -1e4, y: -1e4 };
  const color = v => getComputedStyle(root).getPropertyValue(v).trim();

  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = c.clientWidth; H = c.clientHeight;
    c.width = W * dpr; c.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, (W * H) / 16000));
    pts = Array.from({ length: n }, () => ({
      x: W * (0.35 + Math.random() * 0.65), y: Math.random() * H,
      vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
      r: Math.random() * 1.6 + .6, hub: Math.random() < .08
    }));
  }

  function draw() {
    const a1 = color('--a1'), a2 = color('--a2'), a3 = color('--a3');
    const light = root.dataset.theme === 'light';
    ctx.clearRect(0, 0, W, H);
    const maxD = Math.min(150, W / 6);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (!reduced) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < W * .25 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
        if (d < maxD) {
          ctx.globalAlpha = (1 - d / maxD) * (light ? .35 : .45);
          ctx.strokeStyle = (p.hub || q.hub) ? a2 : a1;
          ctx.lineWidth = .7;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (md < 180) {
        ctx.globalAlpha = (1 - md / 180) * .6; ctx.strokeStyle = a3; ctx.lineWidth = .8;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    for (const p of pts) {
      ctx.globalAlpha = p.hub ? .95 : .7;
      ctx.fillStyle = p.hub ? a3 : a1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.hub ? p.r + 1.6 : p.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduced) raf = requestAnimationFrame(draw);
  }

  size(); draw();
  addEventListener('resize', () => { cancelAnimationFrame(raf); size(); draw(); });
  c.parentElement.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    if (reduced) draw();
  });
  c.parentElement.addEventListener('pointerleave', () => { mouse.x = mouse.y = -1e4; });
  document.getElementById('theme-toggle').addEventListener('click', () => { if (reduced) draw(); });
  /* Pause when hero is off-screen */
  new IntersectionObserver(([en]) => {
    if (reduced) return;
    cancelAnimationFrame(raf);
    if (en.isIntersecting) raf = requestAnimationFrame(draw);
  }).observe(c);
})();

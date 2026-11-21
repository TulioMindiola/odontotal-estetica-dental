/* Odontotal · interacción y movimiento */
(() => {
  const WA = '573003231160';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const waLink = (text) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

  if (!hasGsap || reduce) root.classList.remove('motion-ok');
  else window.__odtReady = true;

  /* ---------- ajustar el nombre al ancho ---------- */
  function fitName(el, { lines = false } = {}) {
    if (!el) return;
    const box = el.parentElement;
    const cs = getComputedStyle(box);
    const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    el.style.fontSize = '100px';
    let w;
    if (lines) {
      w = Math.max(...$$('.hero__chunk', el).map((c) => c.offsetWidth));
    } else {
      w = el.firstElementChild.offsetWidth;
    }
    let size = (100 * avail) / w;
    if (!lines && el === heroName) size = Math.min(size, window.innerHeight * 0.34);
    el.style.fontSize = `${Math.floor(size * 0.995)}px`;
  }
  const heroName = $('[data-fit]');
  const footName = $('[data-fit-foot]');
  const phone = () => window.matchMedia('(max-width: 680px)').matches;
  function fitAll() {
    fitName(heroName, { lines: phone() });
    fitName(footName);
  }

  /* letras del nombre para la entrada */
  if (heroName && root.classList.contains('motion-ok')) {
    $$('.hero__chunk', heroName).forEach((chunk) => {
      chunk.innerHTML = [...chunk.textContent].map((c) => `<span class="ch">${c}</span>`).join('');
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
  fitAll();
  let rT;
  window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { fitAll(); hasGsap && ScrollTrigger.refresh(); }, 120); });

  /* ---------- menú del celular ---------- */
  const menuBtn = $('[data-menu-btn]');
  const menu = $('[data-menu]');
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Cerrar' : 'Menú';
    document.body.classList.toggle('menu-open', open);
    if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
  }
  menuBtn && menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu && $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu && !menu.hidden) setMenu(false); });

  /* ---------- barra fija ---------- */
  const bar = $('[data-bar]');
  const hero = $('.hero');
  if (bar && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => bar.classList.toggle('is-visible', !e.isIntersecting), { rootMargin: '-80px 0px 0px 0px' }).observe(hero);
  }

  /* ---------- planificador: las seis flechas ---------- */
  const PLAN = {
    color: { t: 'Blanqueamiento Zoom', d: 'Varios tonos más blanco en una sesión de una hora.', w: 'el color' },
    encias: { t: 'Limpieza profunda', d: 'Elimina placa y sarro, y protege tus encías.', w: 'la limpieza y las encías' },
    caries: { t: 'Resinas, conductos y reconstrucción', d: 'Tratamos el dolor y le devolvemos la forma al diente.', w: 'una caries o un dolor' },
    forma: { t: 'Microdiseño o diseño de sonrisa', d: 'Forma, tamaño y color en armonía con tu rostro.', w: 'la forma o el tamaño' },
    alineacion: { t: 'Ortodoncia invisible', d: 'Alineadores transparentes, sin brackets metálicos.', w: 'la alineación' },
    falta: { t: 'Implante dental o prótesis', d: 'Recuperas la función y la estética al sonreír.', w: 'un diente que falta' },
  };
  const ORDER = ['forma', 'alineacion', 'falta', 'color', 'encias', 'caries'];
  const dial = $('[data-dial]');
  if (dial) {
    const opts = $$('.opt', dial);
    const list = $('[data-plan-list]');
    const empty = $('[data-plan-empty]');
    const send = $('[data-plan-send]');
    const svg = $('.dial__mark', dial);
    const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    core.setAttribute('class', 'dial__core');
    core.setAttribute('r', '0');
    svg.appendChild(core);

    // posición de cada etiqueta alrededor del símbolo
    function placeOpts() {
      const compact = dial.clientWidth < 560 || window.innerWidth < 1000;
      dial.classList.toggle('dial--compact', compact);
      opts.forEach((o) => {
        const a = (parseFloat(o.style.getPropertyValue('--a')) * Math.PI) / 180;
        const r = compact ? 32 : 37;
        const x = 50 + r * Math.cos(a);
        const y = 50 + r * Math.sin(a) * 1.02;
        o.style.setProperty('--x', `${x}%`);
        o.style.setProperty('--y', `${y}%`);
        o.classList.remove('opt--l', 'opt--r', 'opt--c');
        const c = Math.cos(a);
        o.classList.add(c > 0.2 ? 'opt--r' : c < -0.2 ? 'opt--l' : 'opt--c');
      });
    }
    placeOpts();
    window.addEventListener('resize', placeOpts);

    const sel = new Set();
    function update() {
      const keys = ORDER.filter((k) => sel.has(k));
      list.innerHTML = keys.map((k) => `<li data-k="${k}"><strong>${PLAN[k].t}</strong><span>${PLAN[k].d}</span></li>`).join('');
      empty.hidden = keys.length > 0;
      const sede = ($('input[name="sede"]:checked') || {}).value || 'Suba';
      const wants = keys.map((k) => PLAN[k].w);
      const txt = keys.length
        ? `Hola Odontotal, quiero agendar una valoración en la sede ${sede}. Me gustaría mejorar: ${wants.join(', ')}. (Armé mi plan en su página web.)`
        : `Hola Odontotal, quiero agendar una valoración en la sede ${sede}.`;
      send.href = waLink(txt);
      if (hasGsap && !reduce && keys.length) {
        gsap.fromTo($$('li', list), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .05, ease: 'power3.out' });
      }
      const target = keys.length ? 8 : 0;
      if (hasGsap && !reduce) gsap.to(core, { attr: { r: target }, duration: .6, ease: 'back.out(2)' });
      else core.setAttribute('r', target);
    }
    function toggle(k) {
      const on = !sel.has(k);
      on ? sel.add(k) : sel.delete(k);
      const btn = opts.find((o) => o.dataset.opt === k);
      btn.setAttribute('aria-pressed', String(on));
      const g = $(`[data-arrow="${k}"]`, dial);
      g.classList.toggle('is-on', on);
      const p = $('path', g);
      if (hasGsap && !reduce) gsap.to(p, { x: on ? -11 : 0, duration: .7, ease: on ? 'elastic.out(1, 0.55)' : 'power3.out' });
      else p.setAttribute('transform', on ? 'translate(-11 0)' : '');
      update();
    }
    opts.forEach((o) => o.addEventListener('click', () => toggle(o.dataset.opt)));
    $$('[data-arrow]', dial).forEach((g) => g.addEventListener('click', () => toggle(g.dataset.arrow)));
    $$('input[name="sede"]').forEach((i) => i.addEventListener('change', update));
    update();
  }

  /* ---------- antes y después ---------- */
  const cmp = $('[data-compare]');
  let cmpTouched = false;
  if (cmp) {
    const range = $('[data-compare-range]', cmp);
    const set = (v) => cmp.style.setProperty('--pos', `${v}%`);
    range.addEventListener('input', () => { cmpTouched = true; set(range.value); });
    set(range.value);
    cmp.__set = (v) => { range.value = v; set(v); };
  }

  /* ---------- pasos: fila que se arrastra ---------- */
  const row = $('[data-steps]');
  if (row) {
    const bar = $('[data-steps-bar]');
    const prev = $('[data-steps-prev]');
    const next = $('[data-steps-next]');
    const stepW = () => { const s = $('.step', row); return s ? s.getBoundingClientRect().width + 32 : 300; };
    function paint() {
      const max = row.scrollWidth - row.clientWidth;
      const frac = row.clientWidth / row.scrollWidth;
      const p = max > 0 ? row.scrollLeft / max : 0;
      bar.style.width = `${Math.max(frac * 100, 12)}%`;
      bar.style.transform = `translateX(${p * (1 / Math.max(frac, 0.12) - 1) * 100}%)`;
      if (prev) prev.disabled = row.scrollLeft < 4;
      if (next) next.disabled = row.scrollLeft > max - 4;
    }
    row.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
    paint();
    prev && prev.addEventListener('click', () => row.scrollBy({ left: -stepW(), behavior: reduce ? 'auto' : 'smooth' }));
    next && next.addEventListener('click', () => row.scrollBy({ left: stepW(), behavior: reduce ? 'auto' : 'smooth' }));
    row.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); row.scrollBy({ left: stepW(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); row.scrollBy({ left: -stepW(), behavior: 'smooth' }); }
    });
    // arrastre con mouse
    let down = false, sx = 0, sl = 0, moved = 0;
    row.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = 0; sx = e.clientX; sl = row.scrollLeft;
      row.classList.add('is-dragging'); row.setPointerCapture(e.pointerId);
    });
    row.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
      row.scrollLeft = sl - dx;
    });
    const end = () => {
      if (!down) return; down = false; row.classList.remove('is-dragging');
      const w = stepW(); row.scrollTo({ left: Math.round(row.scrollLeft / w) * w, behavior: 'smooth' });
    };
    row.addEventListener('pointerup', end);
    row.addEventListener('pointercancel', end);
  }

  /* ---------- sedes ---------- */
  const SEDES = {
    chia: {
      addr: 'Offices Center Chía Élite<br>Calle 11 # 6A-56, Chía, Cundinamarca',
      extra: 'Con parqueadero, ascensores y salas de espera.',
      map: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Odontotal Chía Offices Center Chía Élite'),
      btn: 'Agendar en Chía', wa: 'Hola Odontotal, quiero agendar una valoración en la sede Chía.',
    },
    suba: {
      addr: 'C. C. Centro Suba, local 29, tercer piso<br>Calle 145 # 91-19, Bogotá',
      extra: 'Cerca de la estación de TransMilenio Suba – Transversal 91.',
      map: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Odontotal Especialistas en Estetica Dental Centro Suba'),
      btn: 'Agendar en Suba', wa: 'Hola Odontotal, quiero agendar una valoración en la sede Suba.',
    },
  };
  const tabs = $$('[data-sede]');
  if (tabs.length) {
    const panel = $('[data-sede-panel]');
    const setSede = (k) => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.sede === k)));
      $$('[data-visit-img]').forEach((img) => img.classList.toggle('is-on', img.dataset.visitImg === k));
      const s = SEDES[k];
      panel.classList.add('is-swapping');
      setTimeout(() => {
        $('[data-sede-addr]').innerHTML = s.addr;
        $('[data-sede-extra]').textContent = s.extra;
        $('[data-sede-map]').href = s.map;
        panel.classList.remove('is-swapping');
      }, reduce ? 0 : 220);
      const b = $('[data-sede-wa]'); b.textContent = s.btn; b.href = waLink(s.wa);
    };
    tabs.forEach((t) => t.addEventListener('click', () => setSede(t.dataset.sede)));
    tabs.forEach((t, i) => t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = tabs[(i + 1) % tabs.length]; n.focus(); setSede(n.dataset.sede); }
    }));
  }

  /* ---------- servicios: la flecha que se enciende ---------- */
  const track = $('[data-track]');
  const svcs = $$('[data-svc]');
  function lightArrow(i) {
    if (!track) return;
    $$('.m-arrows > g', track).forEach((g, j) => {
      const on = j === i;
      g.classList.toggle('is-on', on);
      const p = $('path', g);
      if (hasGsap && !reduce) gsap.to(p, { x: on ? -10 : 0, duration: .6, ease: 'power3.out' });
    });
  }

  /* ---------- números que cuentan ---------- */
  function countUp(el) {
    const end = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const fmt = (v) => el.dataset.format === 'cop'
      ? Math.round(v).toLocaleString('es-CO')
      : v.toLocaleString('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (!hasGsap || reduce) { el.textContent = fmt(end); return; }
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(o.v); } });
  }

  /* ---------- sin gsap: estado final y listo ---------- */
  if (!hasGsap || reduce) {
    root.classList.remove('motion-ok');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { lightArrow(svcs.indexOf(e.target)); }
      }), { rootMargin: '-45% 0px -45% 0px' });
      svcs.forEach((s) => io.observe(s));
    }
    return;
  }

  /* ================= movimiento (GSAP) ================= */
  gsap.registerPlugin(ScrollTrigger);

  // desplazamiento suave
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      lenis.scrollTo(t, { offset: id === '#top' ? 0 : -10, duration: 1.4 });
      history.replaceState(null, '', id);
    }));
  }

  // entrada del hero: la foto se abre, las flechas convergen, el nombre sube
  const heroImg = $('[data-hero-img]');
  const heroArrows = $$('.mark--hero .m-arrows path');
  const tl = gsap.timeline({
    defaults: { ease: 'power4.out' },
    onComplete: () => { $$('.hero__chunk', heroName).forEach((c) => { c.textContent = c.textContent; }); },
  });
  tl.fromTo('.hero__photo', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.inOut' }, 0)
    .to(heroImg, { scale: 1, duration: 2, ease: 'power3.out' }, 0.05)
    .fromTo('.hero__chunk .ch', { y: 0, yPercent: 105 }, { yPercent: 0, duration: .95, stagger: .035 }, 0.15)
    .fromTo('.mark--hero', { rotate: -60, scale: .6 }, { rotate: 0, scale: 1, duration: 1.3, ease: 'power3.out', transformOrigin: '50% 50%' }, 0.45)
    .fromTo(heroArrows, { x: 46, opacity: 0 }, { x: 0, opacity: 1, duration: .9, stagger: .07, ease: 'power3.out' }, 0.55)
    .fromTo('.hero__nav a, .menu-btn', { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .06 }, 0.7)
    .to('[data-hero-fade]', { opacity: 1, duration: .9, stagger: .1, ease: 'power2.out' }, 0.6)
    .fromTo('[data-hero-fade]', { y: 18 }, { y: 0, duration: .9, stagger: .1, ease: 'power3.out' }, 0.6);

  // firma: el nombre pesa y se encoge al salir; la foto deriva
  gsap.to(heroName, { scale: 0.93, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.fromTo(heroImg, { yPercent: 0 }, { yPercent: 5, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.fromTo(footName, { scale: 0.92 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  gsap.fromTo('.foot__img', { yPercent: -8, scale: 1.12 }, { yPercent: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  // Entradas: el contenido solo se oculta en el instante en que su entrada va a sonar.
  // Lo que nunca se alcanza sigue visible (sin depender de posiciones precalculadas).
  function onApproach(el, prep, play) {
    if (!el) return;
    let prepared = false, played = false;
    const doPrep = () => { if (!prepared) { prepared = true; prep(); } };
    const io1 = new IntersectionObserver(([e]) => { if (e.isIntersecting) { doPrep(); io1.disconnect(); } }, { rootMargin: '0px 0px 25% 0px' });
    const io2 = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !played) { played = true; doPrep(); play(); io2.disconnect(); io1.disconnect(); }
    }, { rootMargin: '0px 0px -10% 0px' });
    io1.observe(el); io2.observe(el);
  }

  // encabezado, texto, imagen, en cascada
  $$('[data-reveal]').forEach((block) => {
    const kids = block.children.length && !block.matches('h2, p, .svc, .case__card, .visit__card') ? [...block.children] : [block];
    onApproach(block,
      () => gsap.set(kids, { y: 28, opacity: 0 }),
      () => gsap.to(kids, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: .08, clearProps: 'transform' }));
  });
  // las fotos se abren
  $$('[data-clip]').forEach((w) => {
    const img = $('img', w);
    onApproach(w,
      () => { gsap.set(w, { clipPath: 'inset(100% 0 0 0)' }); gsap.set(img, { scale: 1.18 }); },
      () => gsap.timeline()
        .to(w, { clipPath: 'inset(0% 0 0 0)', duration: 1.15, ease: 'power4.inOut' })
        .to(img, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0.1));
  });
  // la foto grande de "odontología total" deriva con el scroll
  gsap.fromTo('.about__photo img', { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.about__photo', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.faq__tall img', { yPercent: -5, scale: 1.1 }, { yPercent: 5, scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.faq__pics', start: 'top bottom', end: 'bottom top', scrub: true } });

  // mapa: las dos sedes aparecen
  const pins = $$('[data-pin] circle');
  onApproach($('.about__map'),
    () => gsap.set(pins, { attr: { r: 0 } }),
    () => gsap.to(pins, { attr: { r: 9 }, duration: .9, stagger: .25, ease: 'back.out(3)', delay: .3 }));

  // números
  $$('[data-count]').forEach((el) => onApproach(el, () => {}, () => countUp(el)));

  // planificador: el símbolo entra girando y las flechas convergen
  const dialArrows = $$('.dial__arrows path');
  onApproach($('.dial'),
    () => { gsap.set('.dial__mark', { rotate: -90, scale: .7, opacity: 0, transformOrigin: '50% 50%' }); gsap.set(dialArrows, { x: 70, opacity: 0 }); gsap.set('.opt', { opacity: 0, y: 10 }); },
    () => gsap.timeline()
      .to('.dial__mark', { rotate: 0, scale: 1, opacity: 1, duration: 1.6, ease: 'power4.out' })
      .to(dialArrows, { x: 0, opacity: 1, duration: 1.1, stagger: .08, ease: 'power3.out' }, 0.35)
      .to('.opt', { opacity: 1, y: 0, duration: .7, stagger: .06, ease: 'power3.out', clearProps: 'transform' }, 0.8));

  // servicios: cada fila enciende una flecha del símbolo
  svcs.forEach((s, i) => ScrollTrigger.create({
    trigger: s, start: 'top 55%', end: 'bottom 45%',
    onToggle: (self) => { if (self.isActive) lightArrow(i); },
  }));
  gsap.to('.mark--track', { rotate: 60, ease: 'none', scrollTrigger: { trigger: '.services__body', start: 'top 60%', end: 'bottom 40%', scrub: true } });

  // caso: la comparación se muestra sola una vez
  if (cmp) {
    const o = { v: 55 };
    onApproach(cmp, () => {}, () => {
        if (cmpTouched) return;
        gsap.timeline({ onUpdate: () => { if (!cmpTouched) cmp.__set(o.v.toFixed(1)); } })
          .to(o, { v: 32, duration: 1.1, ease: 'power3.inOut' })
          .to(o, { v: 76, duration: 1.4, ease: 'power3.inOut' })
          .to(o, { v: 55, duration: 1, ease: 'power3.inOut' });
    });
    gsap.fromTo('.compare__img', { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.case', start: 'top bottom', end: 'top top', scrub: true } });
  }

  // pasos: las tarjetas entran de lado
  onApproach($('.steps__row'),
    () => gsap.set('.step', { x: 60, opacity: 0 }),
    () => gsap.to('.step', { x: 0, opacity: 1, duration: 1, stagger: .08, ease: 'power3.out', clearProps: 'transform' }));

  // sedes: la foto se acerca al entrar
  gsap.fromTo('.visit__photos', { scale: 1.1 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.visit', start: 'top bottom', end: 'top top', scrub: true } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fitAll(); ScrollTrigger.refresh(); });
})();

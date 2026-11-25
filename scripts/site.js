// Portfolio : révélations, index interactif, nuage 3D des projets.
// Sans JavaScript, tout le contenu reste visible (les fiches s'empilent).
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  /* ---------- Révélation au défilement (une seule, décalée par --i) ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

  /* ---------- Pages projet : le graphique se dessine quand il apparaît ---------- */
  const draw = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-active'); draw.unobserve(e.target); }
  }), { threshold: 0.25 });
  document.querySelectorAll('[data-draw]:not(.panel)').forEach((el) => {
    if (document.hidden) el.classList.add('is-active'); else draw.observe(el);
  });

  /* ---------- Index : une ligne choisie dessine sa fiche ---------- */
  const rows = [...document.querySelectorAll('.row')];
  const panels = new Map([...document.querySelectorAll('.panel')].map((p) => [p.dataset.id, p]));
  const stage = document.querySelector('.stage');
  let current = null;
  let cloud = null;

  const activate = (id, { scroll = false } = {}) => {
    if (!panels.has(id)) return;
    if (id !== current) {
      rows.forEach((r) => (r.dataset.id === id ? r.setAttribute('aria-current', 'true') : r.removeAttribute('aria-current')));
      panels.forEach((p, k) => {
        if (k === id) {
          p.hidden = false;
          p.classList.remove('is-active');
          void p.offsetWidth; // relance l'animation du visuel
          p.classList.add('is-active');
        } else {
          p.hidden = true;
          p.classList.remove('is-active');
        }
      });
      current = id;
      if (cloud) cloud.setActive(id);
    }
    if (scroll && stage) {
      const r = stage.getBoundingClientRect();
      if (r.top < 0 || r.top > innerHeight * 0.6) stage.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ids = rows.map((r) => r.dataset.id);
  const voisin = (id, pas) => ids[(ids.indexOf(id) + pas + ids.length) % ids.length];

  rows.forEach((row, i) => {
    const id = row.dataset.id;
    if (fine) row.addEventListener('pointerenter', () => activate(id));
    row.addEventListener('focus', () => activate(id));
    row.addEventListener('click', (e) => { e.preventDefault(); activate(id, { scroll: !fine }); });
    // Flèches haut et bas : passer d'un projet à l'autre dans l'index
    row.addEventListener('keydown', (e) => {
      const pas = { ArrowDown: 1, ArrowUp: -1 }[e.key];
      if (!pas) return;
      e.preventDefault();
      rows[(i + pas + rows.length) % rows.length].focus();
    });
  });

  // Boutons précédent et suivant de chaque fiche
  document.querySelectorAll('.panel__step').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sens = btn.nextElementSibling ? 0 : 1;
      activate(btn.dataset.go);
      panels.get(btn.dataset.go).querySelectorAll('.panel__step')[sens].focus({ preventScroll: true });
    });
  });

  // Flèches gauche et droite quand le focus est dans la fiche
  if (stage) stage.addEventListener('keydown', (e) => {
    const pas = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!pas || !current || e.target.closest('input, textarea')) return;
    e.preventDefault();
    const id = voisin(current, pas);
    activate(id);
    panels.get(id).querySelectorAll('.panel__step')[pas > 0 ? 1 : 0].focus({ preventScroll: true });
  });

  /* ---------- Nuage 3D des projets, plein écran ---------- */
  const hero = document.querySelector('.hero[data-loop]');
  const canvas = hero && hero.querySelector('.hero__cloud');
  const dataEl = document.getElementById('cloud-data');

  if (canvas && dataEl && canvas.getContext) {
    const data = JSON.parse(dataEl.textContent);
    const ctx = canvas.getContext('2d');
    const css = getComputedStyle(root);
    const col = (name) => css.getPropertyValue(name).trim();
    const C = { ink: col('--color-ink'), muted: col('--color-muted'), rule: col('--color-rule-2'), cool: col('--color-cool'), accent: col('--color-accent') };
    const fontBody = col('--font-body');

    // Pseudo-aléatoire déterministe : le nuage est toujours le même.
    let seed = 29;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(2 * Math.PI * rnd());

    // Un centre par secteur, sur une sphère (spirale de Fibonacci).
    const k = data.secteurs.length;
    const centres = data.secteurs.map((nom, i) => {
      const y = 1 - (i + 0.5) * (2 / k);
      const r = Math.sqrt(1 - y * y);
      const t = i * Math.PI * (3 - Math.sqrt(5));
      return { nom, x: Math.cos(t) * r * 0.82, y: y * 0.82, z: Math.sin(t) * r * 0.82 };
    });
    const centreDe = Object.fromEntries(centres.map((c) => [c.nom, c]));

    const dust = [];
    centres.forEach((c) => {
      for (let i = 0; i < 110; i++) dust.push({ x: c.x + gauss() * 0.14, y: c.y + gauss() * 0.14, z: c.z + gauss() * 0.14, r: 0.7 + rnd() * 1.1 });
    });
    for (let i = 0; i < 240; i++) {
      const u = rnd() * 2 - 1, t = rnd() * Math.PI * 2, rr = Math.sqrt(1 - u * u) * (0.85 + rnd() * 0.2);
      dust.push({ x: Math.cos(t) * rr, y: u * (0.85 + rnd() * 0.2), z: Math.sin(t) * rr, r: 0.6 + rnd() * 0.6 });
    }
    const nodes = data.projets.map((p) => {
      const c = centreDe[p.secteur];
      return { ...p, x: c.x + gauss() * 0.1, y: c.y + gauss() * 0.1, z: c.z + gauss() * 0.1 };
    });

    let W = 0, H = 0, dpr = 1;
    let rotY = 0.6, rotX = -0.28;
    const spin = reduce ? 0 : 0.00009;
    let grow = reduce || document.hidden ? 1 : 0; // entrée : les points convergent vers leur place (directement en place si l'onglet est masqué)
    let hover = null, active = null, drag = null, projected = [];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      draw();
    };

    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const project = (p) => {
      const g = 0.35 + 0.65 * ease(grow);
      const cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(rotX), sx = Math.sin(rotX);
      const x1 = p.x * cy - p.z * sy, z1 = p.x * sy + p.z * cy;
      const y1 = p.y * cx - z1 * sx, z2 = p.y * sx + z1 * cx;
      const wide = W >= 960; // grand écran : le nuage à droite, le texte à gauche
      const Rx = Math.min(W * (wide ? 0.22 : 0.42), 480) * g;
      const Ry = Math.min(H * 0.4, 400) * g;
      const cx0 = wide ? W * 0.7 : W / 2;
      const f = 2.8, s = f / (f + z2);
      return { X: cx0 + x1 * Rx * s, Y: H * 0.48 + y1 * Ry * s, s, z: z2 };
    };

    function draw() {
      if (!W) return;
      const fade = ease(grow);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = C.muted;
      for (const d of dust) {
        const p = project(d);
        ctx.globalAlpha = Math.max(0.06, 0.55 - p.z * 0.4) * fade;
        ctx.beginPath(); ctx.arc(p.X, p.Y, d.r * p.s, 0, 7); ctx.fill();
      }

      // Projets reliés au centre de leur secteur
      projected = nodes.map((n) => ({ n, ...project(n) })).sort((a, b) => b.z - a.z);
      ctx.strokeStyle = C.rule; ctx.lineWidth = 1;
      for (const q of projected) {
        const c = project(centreDe[q.n.secteur]);
        ctx.globalAlpha = Math.max(0.12, 0.55 - q.z * 0.4) * fade;
        ctx.beginPath(); ctx.moveTo(c.X, c.Y); ctx.lineTo(q.X, q.Y); ctx.stroke();
      }

      // Noms des secteurs
      ctx.font = `500 13px ${fontBody}`;
      ctx.textAlign = 'center';
      ctx.fillStyle = C.muted;
      for (const c of centres) {
        const p = project(c);
        ctx.globalAlpha = Math.max(0, Math.min(0.9, 0.85 - p.z * 1.1)) * fade;
        ctx.fillText(c.nom, p.X, p.Y - 30 * p.s);
      }

      for (const q of projected) {
        const on = q.n.id === active || q.n.id === hover;
        ctx.globalAlpha = Math.max(0.35, 1 - q.z * 0.5) * fade;
        ctx.fillStyle = on ? C.accent : C.cool;
        ctx.beginPath(); ctx.arc(q.X, q.Y, (on ? 7 : 4.6) * q.s, 0, 7); ctx.fill();
        if (on) {
          ctx.globalAlpha = fade;
          ctx.strokeStyle = C.accent; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(q.X, q.Y, 13 * q.s, 0, 7); ctx.stroke();
          ctx.font = `500 15px ${fontBody}`;
          ctx.textAlign = q.X > W * 0.62 ? 'right' : 'left';
          ctx.fillStyle = C.ink;
          ctx.fillText(q.n.nom, q.X + (ctx.textAlign === 'left' ? 20 : -20), q.Y + 5);
        }
      }
      ctx.globalAlpha = 1;
    }

    // Boucle : tourne à l'écran, sauf pendant un glisser, un focus ou une pause demandée.
    const s = { seen: false, focus: false, held: reduce };
    const btn = hero.querySelector('[data-loop-toggle]');
    let raf = 0, last = 0;
    const tick = (t) => {
      const dt = Math.min(48, t - (last || t)); last = t;
      if (grow < 1) grow = Math.min(1, grow + dt / 1600);
      rotY += spin * dt;
      draw();
      raf = requestAnimationFrame(tick);
    };
    // Le mot qui change dans le titre suit le même interrupteur que le nuage
    const mots = [...hero.querySelectorAll('.rotator__word')];
    let motActif = 0, minuteur = 0;
    const tourner = () => {
      mots[motActif].classList.remove('is-on');
      mots[motActif].setAttribute('aria-hidden', 'true');
      motActif = (motActif + 1) % mots.length;
      mots[motActif].classList.add('is-on');
      mots[motActif].removeAttribute('aria-hidden');
    };
    const sync = () => {
      const run = s.seen && !s.focus && !s.held && !drag;
      if (mots.length > 1 && run && !minuteur) minuteur = setInterval(tourner, 2800);
      if ((!run || s.held) && minuteur) { clearInterval(minuteur); minuteur = 0; }
      hero.classList.toggle('is-running', run);
      if (run && !raf) { last = 0; raf = requestAnimationFrame(tick); }
      if (!run && raf) { cancelAnimationFrame(raf); raf = 0; if (grow < 1) { grow = 1; draw(); } }
      btn.textContent = s.held ? 'Lecture' : 'Pause';
      btn.setAttribute('aria-pressed', String(s.held));
    };
    btn.addEventListener('click', () => { s.held = !s.held; sync(); });
    new IntersectionObserver(([e]) => { s.seen = e.isIntersecting; sync(); }).observe(hero);
    hero.addEventListener('focusin', (e) => { if (e.target === btn) return; s.focus = true; sync(); });
    hero.addEventListener('focusout', () => { s.focus = false; sync(); });

    // Glisser pour pivoter ; survoler et cliquer un projet
    const hit = (x, y) => {
      let best = null, bd = 20 * 20;
      for (const q of projected) { const d = (q.X - x) ** 2 + (q.Y - y) ** 2; if (d < bd) { bd = d; best = q.n; } }
      return best;
    };
    const local = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    canvas.addEventListener('pointerleave', () => { if (hover) { hover = null; canvas.style.cursor = ''; draw(); } });
    canvas.addEventListener('pointerdown', (e) => {
      drag = { x: e.clientX, y: e.clientY, moved: false };
      canvas.setPointerCapture(e.pointerId);
      sync();
    });
    canvas.addEventListener('pointermove', (e) => {
      if (drag) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
        rotY += dx * 0.007; rotX = Math.max(-1.2, Math.min(1.2, rotX + dy * 0.007));
        drag.x = e.clientX; drag.y = e.clientY;
        draw();
        return;
      }
      const [x, y] = local(e);
      const h = hit(x, y);
      const id = h ? h.id : null;
      if (id !== hover) { hover = id; canvas.style.cursor = h ? 'pointer' : ''; draw(); }
    });
    const end = (e) => {
      const moved = drag && drag.moved; drag = null;
      if (!moved && e.type === 'pointerup') {
        const [x, y] = local(e);
        const h = hit(x, y);
        if (h) {
          activate(h.id);
          document.getElementById('travaux').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
        }
      }
      sync();
    };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);

    new ResizeObserver(resize).observe(canvas);
    if (document.fonts) document.fonts.ready.then(draw);
    cloud = { setActive: (id) => { active = id; draw(); } };
    sync();
  }

  /* ---------- Navigation : le lien de la section en cours est souligné ---------- */
  const liensNav = [...document.querySelectorAll('.bar__nav a[href^="#"]')];
  const sections = liensNav.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (sections.length) {
    const marquer = (id) => liensNav.forEach((a) => (a.getAttribute('href') === `#${id}`
      ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
    const visibles = new Map();
    const espion = new IntersectionObserver((entries) => {
      entries.forEach((e) => visibles.set(e.target.id, e.isIntersecting));
      const actif = sections.find((s) => visibles.get(s.id));
      marquer(actif ? actif.id : null);
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => espion.observe(s));
  }

  /* ---------- Timeline : la ligne se dessine au fil du défilement ---------- */
  const timeline = document.querySelector('.timeline');
  /* ---------- Bouton « retour en haut » ---------- */
  const totop = document.querySelector('[data-totop]');
  let attente = false;
  const auDefilement = () => {
    attente = false;
    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const p = reduce ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
      timeline.style.setProperty('--progress', p.toFixed(3));
    }
    if (totop) {
      const visible = scrollY > innerHeight * 1.2;
      totop.classList.toggle('is-visible', visible);
      totop.tabIndex = visible ? 0 : -1;
      totop.setAttribute('aria-hidden', String(!visible));
    }
  };
  addEventListener('scroll', () => { if (!attente) { attente = true; requestAnimationFrame(auDefilement); } }, { passive: true });
  addEventListener('resize', auDefilement);
  auDefilement();
  if (totop) totop.addEventListener('click', (e) => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    document.querySelector('.wordmark')?.focus({ preventScroll: true });
  });

  /* ---------- Formulaire de contact (Formspree) ---------- */
  document.querySelectorAll('form[data-endpoint]').forEach((form) => {
    const statut = form.querySelector('.form__status');
    const bouton = form.querySelector('button[type="submit"]');
    const dire = (texte, etat) => { statut.textContent = texte; statut.dataset.state = etat || ''; };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const invalide = [...form.querySelectorAll('[required]')].find((c) => !c.checkValidity());
      form.querySelectorAll('[required]').forEach((c) => c.toggleAttribute('aria-invalid', !c.checkValidity()));
      if (invalide) {
        const champ = form.querySelector(`label[for="${invalide.id}"]`).textContent.toLowerCase();
        dire(invalide.type === 'email' && invalide.value
          ? 'Cette adresse e-mail semble incomplète. Écrivez-la sous la forme nom@exemple.com.'
          : `Il manque ${champ}.`, 'erreur');
        invalide.focus();
        return;
      }
      if (!form.dataset.endpoint) {
        dire('Rien n’a été envoyé : ce formulaire n’est pas encore relié à une boîte de réception.', 'erreur');
        return;
      }
      bouton.setAttribute('aria-busy', 'true');
      bouton.disabled = true;
      dire('Envoi en cours…');
      try {
        const r = await fetch(form.dataset.endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error(String(r.status));
        form.reset();
        dire('Merci, votre message est bien parti. Je vous réponds dès que possible.', 'ok');
      } catch {
        dire('L’envoi n’a pas abouti. Réessayez dans un instant, ou écrivez-moi via LinkedIn.', 'erreur');
      } finally {
        bouton.removeAttribute('aria-busy');
        bouton.disabled = false;
      }
    });
    form.querySelectorAll('[required]').forEach((c) => c.addEventListener('input', () => c.removeAttribute('aria-invalid')));
  });

  /* ---------- Première fiche affichée ---------- */
  if (rows.length) activate(rows[0].dataset.id);
})();

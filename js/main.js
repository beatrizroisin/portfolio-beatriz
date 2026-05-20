/* =========================================
   CURSOR
========================================= */
const cur  = document.getElementById('cur');
const curR = document.getElementById('cur-r');

document.addEventListener('mousemove', e => {
  cur.style.left  = e.clientX + 'px';
  cur.style.top   = e.clientY + 'px';
  curR.style.left = e.clientX + 'px';
  curR.style.top  = e.clientY + 'px';
});

/* =========================================
   CANVAS — particles + grid + mouse glow
========================================= */
const cv = document.getElementById('cv');
const cx = cv.getContext('2d');
let W, H, pts = [];

function resize() {
  W = cv.width  = window.innerWidth;
  H = cv.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.init(true); }
  init(full) {
    this.x   = Math.random() * W;
    this.y   = full ? Math.random() * H : H + 4;
    this.s   = Math.random() * 1.3 + .3;
    this.vy  = -(Math.random() * .38 + .07);
    this.vx  = (Math.random() - .5) * .11;
    this.op  = Math.random() * .4 + .08;
    this.life = 0;
    this.max  = Math.random() * 260 + 180;
  }
  tick() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.y < -4 || this.life > this.max) this.init(false);
  }
  draw() {
    cx.save();
    cx.globalAlpha = this.op * (1 - this.life / this.max);
    cx.fillStyle   = '#8b5cf6';
    cx.shadowColor = '#8b5cf6';
    cx.shadowBlur  = 5;
    cx.beginPath();
    cx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
    cx.fill();
    cx.restore();
  }
}

for (let i = 0; i < 100; i++) pts.push(new Particle());

let mx = 0, my = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function frame() {
  cx.clearRect(0, 0, W, H);

  // grid
  cx.strokeStyle = 'rgba(139,92,246,.02)';
  cx.lineWidth   = 1;
  for (let x = 0; x < W; x += 56) { cx.beginPath(); cx.moveTo(x,0); cx.lineTo(x,H); cx.stroke(); }
  for (let y = 0; y < H; y += 56) { cx.beginPath(); cx.moveTo(0,y); cx.lineTo(W,y); cx.stroke(); }

  // mouse glow
  const g = cx.createRadialGradient(mx, my, 0, mx, my, 320);
  g.addColorStop(0, 'rgba(139,92,246,.055)');
  g.addColorStop(1, 'rgba(139,92,246,0)');
  cx.fillStyle = g;
  cx.fillRect(0, 0, W, H);

  pts.forEach(p => { p.tick(); p.draw(); });
  requestAnimationFrame(frame);
}
frame();

/* =========================================
   PROJECT CARD — mouse glow
========================================= */
document.addEventListener('mousemove', e => {
  document.querySelectorAll('.pj-card').forEach(card => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
  });
});

/* =========================================
   SCROLL REVEAL + SKILL BARS
========================================= */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      e.target.querySelectorAll('.sk-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* =========================================
   LANGUAGE COLOR MAP
========================================= */
const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python:  '#3572A5',
  Go:         '#00ADD8', Rust:       '#dea584', Java:    '#b07219',
  'C#':       '#178600', 'C++':      '#f34b7d', PHP:     '#4F5D95',
  Ruby:       '#701516', Swift:      '#F05138', Kotlin:  '#A97BFF',
  CSS:        '#563d7c', HTML:       '#e34c26', Vue:     '#41b883',
  Dart:       '#00B4AB', Shell:      '#89e051'
};

/* =========================================
   GITHUB CONFIG
   ─────────────────────────────────────────
   Username fixo: beatrizroisin
   Os repos carregam automaticamente quando
   a página abre — sem precisar digitar nada.
   O campo de input fica oculto dos visitantes.
========================================= */
const GH_USERNAME = 'beatrizroisin';

let allRepos     = [];
let activeFilter = 'all';

async function loadGH(usernameOverride) {
  const username = usernameOverride || GH_USERNAME;

  const grid    = document.getElementById('p-grid');
  const loading = document.getElementById('p-load');
  const errEl   = document.getElementById('p-err');
  const filters = document.getElementById('pf');

  // Reset UI
  grid.style.display    = 'none';
  loading.classList.add('on');
  errEl.classList.remove('on');
  filters.style.display = 'none';

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`)
    ]);

    if (!userRes.ok) throw new Error(`GitHub user "${username}" not found.`);

    const user  = await userRes.json();
    const repos = await reposRes.json();

    // Update hero repo count stat
    const repoStat = document.getElementById('s-repos');
    if (repoStat) {
      repoStat.innerHTML = user.public_repos + '<span>+</span>';
    }

    // Update GitHub contact link
    const ghLink = document.getElementById('gh-ct');
    if (ghLink) {
      ghLink.href      = `https://github.com/${user.login}`;
      ghLink.innerHTML = `<span class="ct-lk-ic">⌥</span> github.com/${user.login}`;
    }

    // Update hidden input to reflect current username
    const input = document.getElementById('gh-in');
    if (input) input.value = user.login;

    // Filter forks out
    allRepos = repos.filter(r => !r.fork);

    buildFilters(allRepos);
    renderRepos(allRepos);

  } catch (err) {
    errEl.textContent = '⚠ ' + err.message;
    errEl.classList.add('on');
    grid.innerHTML     = '';
    grid.style.display = 'grid';
  } finally {
    loading.classList.remove('on');
  }
}

// Enter key on the hidden input (fallback override)
document.getElementById('gh-in').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const val = document.getElementById('gh-in').value.trim();
    if (val) loadGH(val);
  }
});

function buildFilters(repos) {
  const langs   = [...new Set(repos.map(r => r.language).filter(Boolean))];
  const wrapper = document.getElementById('pf');

  wrapper.style.display = 'flex';
  wrapper.innerHTML = `<button class="fl on" onclick="filterRepos(this,'all')">All</button>`;

  langs.forEach(lang => {
    const btn = document.createElement('button');
    btn.className   = 'fl';
    btn.textContent = lang;
    btn.onclick     = () => filterRepos(btn, lang);
    wrapper.appendChild(btn);
  });
}

function filterRepos(btn, lang) {
  document.querySelectorAll('.fl').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  activeFilter = lang;
  renderRepos(lang === 'all' ? allRepos : allRepos.filter(r => r.language === lang));
}

function renderRepos(repos) {
  const grid = document.getElementById('p-grid');
  grid.style.display = 'grid';

  if (!repos.length) {
    grid.innerHTML = '<div class="pj-empty"><span>◈</span>No repositories for this filter.</div>';
    return;
  }

  grid.innerHTML = repos.slice(0, 12).map((repo, i) => {
    const langColor = LANG_COLORS[repo.language] || '#6e7681';
    const topics    = (repo.topics || []).slice(0, 3);
    const desc      = repo.description || 'No description provided.';

    return `
    <div class="pj-card" style="animation-delay:${i * 0.06}s">
      <div class="pj-top">
        <div class="pj-ico">◆</div>
        <div class="pj-lks">
          <a href="${repo.html_url}" target="_blank" class="pj-lk" title="View on GitHub">⌥</a>
          ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="pj-lk" title="Live demo">↗</a>` : ''}
        </div>
      </div>
      <div class="pj-name">${repo.name}</div>
      <div class="pj-desc">${desc}</div>
      ${topics.length
        ? `<div style="display:flex;gap:4px;flex-wrap:wrap">
             ${topics.map(t => `<span class="pj-tag">${t}</span>`).join('')}
           </div>`
        : ''
      }
      <div class="pj-ft">
        ${repo.language
          ? `<span class="pj-lang">
               <span class="ld" style="background:${langColor}"></span>
               ${repo.language}
             </span>`
          : ''
        }
        ${repo.stargazers_count > 0 ? `<span class="pj-stat">⭐ ${repo.stargazers_count}</span>` : ''}
        ${repo.forks_count      > 0 ? `<span class="pj-stat">⑂ ${repo.forks_count}</span>`      : ''}
      </div>
    </div>`;
  }).join('');
}

/* =========================================
   CONTACT FORM — Formspree AJAX
   ─────────────────────────────────────────
   Sends form to Formspree → chega no seu
   e-mail. Sem backend, sem servidor.
   Troque SEU_FORMSPREE_ID no index.html.
========================================= */
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  const submitBtn = this.querySelector('.cf-sub');
  const statusEl  = document.getElementById('cf-status');

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled    = true;

  try {
    const response = await fetch(this.action, {
      method:  'POST',
      body:    new FormData(this),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      statusEl.className   = 'cf-msg ok';
      statusEl.textContent = "✓ Message sent! I'll get back to you soon.";
      this.reset();
    } else {
      const data = await response.json();
      throw new Error(data.errors?.map(err => err.message).join(', ') || 'Something went wrong.');
    }
  } catch (err) {
    statusEl.className   = 'cf-msg er';
    statusEl.textContent = '⚠ ' + err.message + ' — Try emailing directly.';
  } finally {
    submitBtn.textContent = 'Send Message →';
    submitBtn.disabled    = false;
    setTimeout(() => { statusEl.className = 'cf-msg'; }, 6000);
  }
});

/* =========================================
   AUTO-LOAD GitHub on page ready
   ─────────────────────────────────────────
   Carrega os repos de beatrizroisin
   automaticamente assim que a página abre.
   Visitantes já veem os projetos sem
   precisar digitar nada.
========================================= */
document.addEventListener('DOMContentLoaded', () => {
  loadGH(GH_USERNAME);
});

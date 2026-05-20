# Beatriz Roisin — Portfolio LP

## Estrutura de arquivos

```
beatriz-portfolio/
├── index.html          ← página principal
├── css/
│   └── style.css       ← todos os estilos
├── js/
│   └── main.js         ← canvas, GitHub API, formulário
├── assets/
│   └── character.png   ← sua personagem (fundo removido)
└── README.md
```

---

## ✅ PASSO 1 — Configurar o GitHub (seção Projects)

A seção Projects puxa seus repositórios reais via GitHub API pública.
**Não precisa de token** para repositórios públicos.

### Como funciona:
1. O visitante digita seu username na seção Projects e clica em Load
2. OU você pode deixar pré-carregado — adicione ao final de `js/main.js`:

```js
// Coloque seu username aqui para carregar automaticamente:
document.getElementById('gh-in').value = 'SEU_USERNAME_GITHUB';
loadGH();
```

### Para deixar pré-carregado com seu username:
Abra `js/main.js`, vá para o final do arquivo e adicione:
```js
// Auto-load GitHub repos on page load
window.addEventListener('load', () => {
  document.getElementById('gh-in').value = 'beatrizroisin'; // ← seu username
  loadGH();
});
```

---


## ✅ PASSO 2 — Trocar seus dados pessoais

Abra `index.html` e substitua os seguintes campos:

| Campo | Onde está | O que substituir |
|-------|-----------|-----------------|
| Email | `<a href="mailto:SEU_EMAIL@gmail.com"` | Seu email real |
| GitHub link | `href="https://github.com/SEU_GITHUB"` | Seu username |
| LinkedIn | já está correto | confirme o link |

---

## ✅ PASSO 3 — Publicar no Vercel (recomendado)

### Opção A — GitHub + Vercel (melhor opção)

1. Crie um repositório no GitHub:
```bash
git init
git add .
git commit -m "feat: portfolio"
git remote add origin https://github.com/SEU_USER/portfolio.git
git push -u origin main
```

2. Acesse https://vercel.com → **New Project**
3. Importe o repositório
4. Framework: **Other** (HTML estático)
5. Clique em **Deploy** ✅

### Opção B — Netlify Drop (mais rápido, zero config)

1. Acesse: https://app.netlify.com/drop
2. Arraste a pasta `beatriz-portfolio/` inteira
3. Pronto — URL gerada na hora ✅

### Opção C — GitHub Pages (grátis)

1. Suba o projeto para um repositório GitHub
2. Vá em **Settings → Pages**
3. Source: `main` branch, pasta `/ (root)`
4. Clique em **Save** ✅

---

## ✅ PASSO 4 — Domínio customizado (opcional)

Após publicar no Vercel ou Netlify, você pode conectar um domínio próprio
como `beatrizroisin.dev` — ambas as plataformas oferecem isso gratuitamente
nas configurações do projeto.

---

## Checklist final antes de publicar

- [ ] Substituí `SEU_EMAIL@gmail.com` pelo meu e-mail real
- [ ] Substituí `SEU_GITHUB` pelo meu username do GitHub
- [ ] Cadastrei no Formspree e colei o ID no `action` do form
- [ ] Testei o formulário (manda um email de teste)
- [ ] Adicionei meu username do GitHub para auto-carregar os repos
- [ ] Conferi o link do LinkedIn

---

## Tecnologias usadas

- HTML5 semântico
- CSS3 (custom properties, animations, grid, backdrop-filter)
- JavaScript vanilla (Canvas API, Fetch API, IntersectionObserver)
- GitHub REST API (pública, sem token)
- Formspree (email de formulário)
- Google Fonts (Syne + JetBrains Mono + DM Sans)

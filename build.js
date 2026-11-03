// Génère _site/index.html à partir de content/site.json (les textes)
// et src/styles.css (la mise en page). Aucune dépendance : `node build.js`.
const fs = require('fs');
const path = require('path');

const root = __dirname;
const c = JSON.parse(fs.readFileSync(path.join(root, 'content/site.json'), 'utf8'));
const css = fs.readFileSync(path.join(root, 'src/styles.css'), 'utf8');

// Échappe le texte ; *texte* devient de l'italique.
const t = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  .replace(/\*([^*]+)\*/g, '<i>$1</i>');
const a = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const each = (list, fn) => (list || []).map(fn).join('\n');

const b = c.banniere, cp = c.campagne, l = cp.livre, p = c.prix, pa = c.partenaires;
const mailto = `mailto:${pa.email}?subject=${encodeURIComponent('Partenariat ONG KINA')}`;

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t(c.seo.titre_onglet)}</title>
<meta name="description" content="${a(c.seo.description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Mulish:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
${css}
</style>
</head>
<body>

<div class="top">
  <div class="wrap">
    <div class="nav">
      <a class="brand" href="#accueil"><img src="images/kina-logo.png" alt="" width="409" height="516"><span><b>KINA</b><small>ONG</small></span></a>
      <ul>
        <li><a href="#campagne">${t(c.menu.campagne)}</a></li>
        <li><a href="#prix">${t(c.menu.prix)}</a></li>
        <li><a href="#partenaires">${t(c.menu.partenaires)}</a></li>
      </ul>
    </div>
  </div>
</div>

<header class="banner" id="accueil">
  <img class="banner-img" src="${a(b.image)}" alt="${a(b.image_description)}" width="2000" height="1116">
  <div class="wrap banner-in">
    <div class="banner-text">
      <div class="over">${t(b.surtitre)}</div>
      <h1>${t(b.titre_debut)} <span class="red">${t(b.titre_rouge)}</span><span class="green">${t(b.titre_vert)}</span></h1>
      <div class="rule"></div>
      <p>${t(b.texte)}</p>
      <div class="cta">
        <a class="btn gold" href="#partenaires">${t(b.bouton_1)}</a>
        <a class="btn light" href="#prix">${t(b.bouton_2)}</a>
      </div>
    </div>
  </div>
</header>

<div class="pillars" aria-label="Nos engagements">
  <div class="wrap">
${each(c.engagements, (e, i) => `    <div class="pillar"><div class="ic">${i + 1}</div><b>${t(e.titre)}</b><span>${t(e.texte)}</span></div>`)}
  </div>
</div>

<section class="acro-sec" aria-label="Signification du nom KINA">
  <div class="wrap">
    <div class="over" style="margin-bottom:12px">${t(c.acronyme.surtitre)}</div>
    <div class="acro">
${each(c.acronyme.lettres, (x) => `      <div><b>${t(x.lettre)}</b><span>${t(x.mot)}</span><i>${t(x.explication)}</i></div>`)}
    </div>
  </div>
</section>

<main>
  <section class="campagne" id="campagne">
    <div class="wrap">
      <div class="head">
        <div><div class="over">${t(cp.surtitre)}</div><h2>${t(cp.titre_debut)} <span class="red">${t(cp.titre_rouge)}</span></h2></div>
        <p>${t(cp.intro)}</p>
      </div>

      <div class="book-band">
        <div class="cover"><span class="a">${t(l.auteur)}</span><span class="t">${t(l.titre_couverture)}<br><em>${t(l.sous_titre_couverture)}</em></span><span class="g">${t(l.mention_couverture)}</span></div>
        <div>
          <div class="over">${t(l.surtitre)}</div>
          <h3>${t(l.titre)}</h3>
          <p>${t(l.texte)}</p>
        </div>
      </div>

      <ol class="steps">
${each(cp.etapes, (s, i) => `        <li><div class="n">${i + 1}</div><h3>${t(s.titre)}</h3><p>${t(s.texte)}</p>${s.bouton_texte && s.bouton_lien ? `<a class="btn gold" href="${a(s.bouton_lien)}">${t(s.bouton_texte)}</a>` : ''}</li>`)}
      </ol>
    </div>
  </section>

  <section class="prix" id="prix">
    <div class="wrap">
      <div class="head">
        <div><div class="over">${t(p.surtitre)}</div><h2>${t(p.titre)}</h2></div>
        <p>${t(p.intro)}</p>
      </div>
      <p class="motto">${t(p.devise)}</p>

      <div class="cats">
        <div class="cat grand"><h3>${t(p.grand_prix.titre)}</h3><p>${t(p.grand_prix.texte)}</p></div>
${each(p.categories, (x) => `        <div class="cat"><h3>${t(x.titre)}</h3><p>${t(x.texte)}</p></div>`)}
      </div>

      <div class="sub">
        <div>
          <h3>${t(p.criteres_titre)}</h3>
          <ul class="crit">
${each(p.criteres, (x, i) => `            <li><b>${i + 1}</b><div><strong>${t(x.titre)}</strong><span>${t(x.texte)}</span></div></li>`)}
          </ul>
        </div>
        <div>
          <h3>${t(p.recompenses_titre)}</h3>
          <ul class="reward">
${each(p.recompenses, (x) => `            <li>${t(x)}</li>`)}
          </ul>
          <div class="chain">
            <h4>${t(p.solidarite.titre)}</h4>
            <p>${t(p.solidarite.texte)}</p>
          </div>
        </div>
      </div>

      <div class="gov">
${each(p.gouvernance, (x) => `        <div><div class="over">Gouvernance</div><h3>${t(x.titre)}</h3><p>${t(x.texte)}</p></div>`)}
      </div>

      <div class="horizon">
${each(p.horizons, (x) => `        <div><span class="over">${t(x.periode)}</span><p>${t(x.texte)}</p></div>`)}
      </div>
    </div>
  </section>

  <section class="partners" id="partenaires">
    <div class="wrap">
      <div>
        <div class="over">${t(pa.surtitre)}</div>
        <h2>${t(pa.titre)}</h2>
        <p style="color:var(--muted);max-width:46ch">${t(pa.texte)}</p>
        <dl class="contact">
          <div><dt>WhatsApp</dt><dd><a href="https://wa.me/${a(pa.whatsapp_numero)}">${t(pa.whatsapp_affiche)}</a></dd></div>
          <div><dt>E-mail</dt><dd><a href="${a(mailto)}">${t(pa.email)}</a></dd></div>
        </dl>
      </div>
      <ul class="why">
${each(pa.arguments, (x) => `        <li><strong>${t(x.titre)}</strong><span>${t(x.texte)}</span></li>`)}
      </ul>
    </div>
  </section>
</main>

<footer>
  <div class="wrap">
    <span>${t(c.pied_de_page.gauche)}</span>
    <span>${t(c.pied_de_page.droite)}</span>
  </div>
</footer>
</body>
</html>
`;

const out = path.join(root, '_site');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
fs.cpSync(path.join(root, 'images'), path.join(out, 'images'), { recursive: true });
if (fs.existsSync(path.join(root, 'CNAME'))) fs.copyFileSync(path.join(root, 'CNAME'), path.join(out, 'CNAME'));
console.log('Site généré dans _site/');

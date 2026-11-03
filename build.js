// Génère le site à partir des textes (content/site.json en français,
// content/site.en.json en anglais) et de src/styles.css (la mise en page).
// Aucune dépendance : `node build.js`.
const fs = require('fs');
const path = require('path');

const root = __dirname;
const css = fs.readFileSync(path.join(root, 'src/styles.css'), 'utf8');
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));

// Adresse définitive du site (sert à Google : adresse de référence, langues, plan du site).
const cnameFile = path.join(root, 'CNAME');
const domain = fs.existsSync(cnameFile) ? fs.readFileSync(cnameFile, 'utf8').trim() : 'kina-ong.org';
const SITE = `https://${domain}/`;

// Les deux langues : dossier de sortie, fichier de textes et petits libellés fixes.
const LANGS = [
  { code: 'fr', locale: 'fr_FR', dir: '', file: 'content/site.json',
    ui: { engagements: 'Nos engagements', acronyme: 'Signification du nom KINA', gouvernance: 'Gouvernance',
          email: 'E-mail', sujet: 'Partenariat ONG KINA', menu: 'Menu principal', autre: 'Read this page in English' } },
  { code: 'en', locale: 'en_GB', dir: 'en/', file: 'content/site.en.json',
    ui: { engagements: 'Our commitments', acronyme: 'What the name KINA means', gouvernance: 'Governance',
          email: 'Email', sujet: 'Partnership with KINA NGO', menu: 'Main menu', autre: 'Lire cette page en français' } },
];
const urlOf = (L) => SITE + L.dir;

// Échappe le texte ; *texte* devient de l'italique.
const t = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  .replace(/\*([^*]+)\*/g, '<i>$1</i>');
const a = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const each = (list, fn) => (list || []).map(fn).join('\n');
const isUrl = (s) => /^(https?:|mailto:|tel:|#)/.test(String(s || ''));

function render(c, L) {
const other = LANGS.find((x) => x !== L);
const up = L.dir ? '../' : '';            // chemin vers la racine (images, autre langue)
const img = (s) => (isUrl(s) || String(s).startsWith('/') ? s : up + s);
const b = c.banniere, cp = c.campagne, l = cp.livre, p = c.prix, pa = c.partenaires;
const mailto = `mailto:${pa.email}?subject=${encodeURIComponent(L.ui.sujet)}`;
const imageAbs = isUrl(b.image) ? b.image : SITE + String(b.image).replace(/^\//, '');

// Fiche d'identité de l'ONG pour Google (données structurées schema.org).
const ld = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  '@id': SITE + '#ong',
  name: 'ONG KINA',
  alternateName: ['KINA NGO', 'KINA'],
  url: SITE,
  logo: SITE + 'images/kina-logo.png',
  image: imageAbs,
  description: c.seo.description,
  email: pa.email,
  telephone: '+' + pa.whatsapp_numero,
  address: { '@type': 'PostalAddress', addressCountry: 'CI' },
  areaServed: [{ '@type': 'Country', name: "Côte d'Ivoire" }, { '@type': 'Place', name: 'West Africa' }],
  knowsAbout: ['Child protection', 'Child abuse prevention', 'Children\'s rights', 'Women\'s empowerment',
    'Protection de l\'enfance', 'Maltraitance infantile', 'Humanitarian award'],
  knowsLanguage: ['fr', 'en'],
  contactPoint: { '@type': 'ContactPoint', contactType: 'partnerships', email: pa.email,
    telephone: '+' + pa.whatsapp_numero, availableLanguage: ['French', 'English'] },
};
const jsonld = JSON.stringify(ld).replace(/</g, '\\u003c');
const verif = String(c.seo.google_verification || '').trim();

return `<!DOCTYPE html>
<html lang="${L.code}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t(c.seo.titre_onglet)}</title>
<meta name="description" content="${a(c.seo.description)}">
<link rel="canonical" href="${urlOf(L)}">
${LANGS.map((x) => `<link rel="alternate" hreflang="${x.code}" href="${urlOf(x)}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${SITE}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ONG KINA">
<meta property="og:title" content="${a(c.seo.titre_onglet)}">
<meta property="og:description" content="${a(c.seo.description)}">
<meta property="og:url" content="${urlOf(L)}">
<meta property="og:image" content="${a(imageAbs)}">
<meta property="og:image:alt" content="${a(b.image_description)}">
<meta property="og:locale" content="${L.locale}">
<meta property="og:locale:alternate" content="${other.locale}">
<meta name="twitter:card" content="summary_large_image">
${verif ? `<meta name="google-site-verification" content="${a(verif)}">\n` : ''}<link rel="icon" href="${up}images/kina-logo.png" type="image/png">
<script type="application/ld+json">${jsonld}</script>
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
    <nav class="nav" aria-label="${a(L.ui.menu)}">
      <a class="brand" href="#accueil"><img src="${up}images/kina-logo.png" alt="" width="409" height="516"><span><b>KINA</b><small>ONG</small></span></a>
      <ul>
        <li><a href="#campagne">${t(c.menu.campagne)}</a></li>
        <li><a href="#prix">${t(c.menu.prix)}</a></li>
        <li><a href="#partenaires">${t(c.menu.partenaires)}</a></li>
        <li class="lang"><a href="${other.dir ? up + other.dir : up || './'}" hreflang="${other.code}" lang="${other.code}" title="${a(L.ui.autre)}">${t(c.seo.lien_langue || other.code.toUpperCase())}</a></li>
      </ul>
    </nav>
  </div>
</div>

<header class="banner" id="accueil">
  <img class="banner-img" src="${a(img(b.image))}" alt="${a(b.image_description)}" width="2000" height="1116">
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

<div class="pillars" aria-label="${a(L.ui.engagements)}">
  <div class="wrap">
${each(c.engagements, (e, i) => `    <div class="pillar"><div class="ic">${i + 1}</div><b>${t(e.titre)}</b><span>${t(e.texte)}</span></div>`)}
  </div>
</div>

<section class="acro-sec" aria-label="${a(L.ui.acronyme)}">
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
${each(p.gouvernance, (x) => `        <div><div class="over">${t(L.ui.gouvernance)}</div><h3>${t(x.titre)}</h3><p>${t(x.texte)}</p></div>`)}
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
          <div><dt>${t(L.ui.email)}</dt><dd><a href="${a(mailto)}">${t(pa.email)}</a></dd></div>
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
}

const out = path.join(root, '_site');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const L of LANGS) {
  fs.mkdirSync(path.join(out, L.dir), { recursive: true });
  fs.writeFileSync(path.join(out, L.dir, 'index.html'), render(read(L.file), L));
}
fs.cpSync(path.join(root, 'images'), path.join(out, 'images'), { recursive: true });
if (fs.existsSync(cnameFile)) fs.copyFileSync(cnameFile, path.join(out, 'CNAME'));

// Plan du site et consignes pour les robots des moteurs de recherche.
const today = new Date().toISOString().slice(0, 10);
const alts = LANGS.map((x) => `    <xhtml:link rel="alternate" hreflang="${x.code}" href="${urlOf(x)}"/>`).join('\n');
fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map((L) => `  <url>
    <loc>${urlOf(L)}</loc>
    <lastmod>${today}</lastmod>
${alts}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}"/>
  </url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
console.log('Site généré dans _site/ (français, anglais, sitemap.xml, robots.txt)');

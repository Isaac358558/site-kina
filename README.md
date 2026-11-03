# Site de l'ONG KINA

- Les textes du site sont dans `content/site.json` (français) et `content/site.en.json` (anglais, page `/en/`). Ils se modifient sans coder depuis **https://app.pagescms.org** (connexion avec ce compte GitHub).
- Les images sont dans `images/`.
- À chaque enregistrement, GitHub reconstruit et publie automatiquement le site (`node build.js`, voir `.github/workflows/deploy.yml`).
- Le référencement (titre, description, versions linguistiques, fiche ONG pour Google, `sitemap.xml`, `robots.txt`) est généré par `build.js` avec l'adresse définitive lue dans `CNAME`.

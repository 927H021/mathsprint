# MathSprint — application installable (iPhone)

Une fois publiée sur internet, l'app s'installe sur l'écran d'accueil : icône, plein écran,
et elle fonctionne sans connexion. Tous les fichiers sont à la racine (pas de sous-dossiers),
pour pouvoir les envoyer d'un seul coup depuis un iPhone.

## Publier depuis l'iPhone (GitHub Pages, gratuit)

1. Dans Fichiers, appuie sur le zip pour le décompresser.
2. Dans Safari, va sur github.com et crée un compte gratuit.
3. Crée un dépôt : « + » puis « New repository », nom `mathsprint`, **Public**, puis « Create repository ».
4. Sur la page du dépôt vide, appuie sur « uploading an existing file », puis « choose your files ».
   Sélectionne **tous** les fichiers du dossier décompressé, puis « Commit changes ».
5. Ouvre « Settings » puis « Pages ». Dans « Source », choisis « Deploy from a branch »,
   branche `main`, dossier `/ (root)`, puis « Save ».
6. Après 1 à 2 minutes, l'adresse est : `https://TON-PSEUDO.github.io/mathsprint/`

## Installer sur l'écran d'accueil

Ouvre cette adresse dans **Safari** (pas dans une autre app), puis Partager → « Sur l'écran d'accueil ».
Lance l'app une première fois avec du réseau, ensuite elle marche hors ligne.

## Autres hébergeurs

Netlify (Drop), Cloudflare Pages ou tout hébergement statique en https fonctionnent aussi.
`index.html` doit être à la racine, avec `sw.js` et `manifest.webmanifest`.

## Mettre à jour plus tard

Après avoir modifié les fichiers, change `CACHE_VERSION` au début de `sw.js` (par exemple
`mathsprint-v2`) puis republie. L'app se met à jour au lancement suivant.

## À savoir

- Records, séances et points faibles sont enregistrés **sur l'appareil** (pas de compte ni de
  synchronisation). La version de la conversation et l'app installée ne partagent pas leurs données.
- Le dépôt GitHub public contient seulement le code de l'app, aucune donnée personnelle.
- App Store / Google Play : étape à part (projet natif, par exemple Capacitor, compte développeur
  Apple 99 $/an, Mac avec Xcode). Ce paquet en est la base.

## Licences des polices

Inter et JetBrains Mono (licence SIL Open Font) sont incluses avec leurs licences.

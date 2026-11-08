# Instructions Pour Agents

Ce depot est a la fois une application Express/EJS et un corpus poetique. Ne le traiter ni comme une simple base de pages statiques, ni comme un projet a "nettoyer" selon des criteres purement techniques.

Principe directeur:

> Chaque signe y possede son double ou presque.

## Lecture Du Projet

- Les noms proches ne sont pas forcement des doublons accidentels. `Lettre` / `lettre`, `U` / `u`, `bZz` / `bzZ` / `bzz`, ou encore un nom encode et son nom lisible peuvent etre des doubles, des traces, des variations ou des etats differents du meme signe.
- Ne pas fusionner, renommer, supprimer ou dedupliquer ces variations sans demande explicite.
- Preferer les mots "double", "variation" ou "ambiguite logique" a "collision" quand on parle du systeme poetique.
- Les accents, la casse, la ponctuation, les espacements, les inversions et les graphies inhabituelles peuvent porter du sens. Ne pas les corriger comme de simples fautes.

## Regles Techniques

- Conserver les `console.log` existants: ils servent a l'auteur.
- La creation automatique de pages par `GET /:word` doit rester limitee au mode auteur/dev. Ne pas la reactiver en production.
- Les nouvelles pages doivent utiliser un nom lisible normalise en NFC, quand c'est possible, et suivre la structure minimale:

```ejs
<%- include('../partials/header'); %>
<pre>
mot
</pre>
<%- include('../partials/footer'); %>
```

- Garder la compatibilite avec les anciens fichiers dont le nom est URL-encode.
- Les liens internes doivent etre absolus (`/mot`), pas relatifs (`mot`).
- Les noms de pages doivent rester bornes a des mots/slug surs: lettres Unicode, chiffres et tirets. Pas de chemins, slashs encodes ou extensions parasites.
- Ne pas reecrire le contenu poetique pour le rendre plus lisible, plus standard ou plus conforme au HTML, sauf correction mecanique evidente et demandee.

## Audit Et Verification

- Apres une modification de routes, vues ou generation de pages, lancer `npm test`.
- Pour les changements touchant `views/pages`, verifier aussi:
  - rendu EJS sans erreur;
  - absence de liens internes casses;
  - absence de liens relatifs involontaires;
  - absence d'artefacts de test dans `views/pages`.
- Separer les problemes mecaniques des decisions editoriales. Une page absente, un double de casse ou une forme encodee peuvent etre une decision d'ecriture.

## Posture

Respecter l'instrument avant de l'optimiser. Le role de l'agent est de stabiliser l'application sans ecraser le systeme de signes.

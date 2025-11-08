import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Pour obtenir __dirname dans ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function extractPageReferences() {
  const pagesDir = path.join(__dirname, '../views/pages');
  let files = [];

  try {
    files = await fs.readdir(pagesDir);
  } catch (err) {
    console.error('Erreur lecture dossier pages', err);
    return { activeLinks: [], inactiveLinks: [] };
  }

  // Filtrer uniquement les fichiers .ejs
  const ejsFiles = files.filter(f => f.endsWith('.ejs'));
  const pageNames = ejsFiles.map(f => path.parse(f).name.toLowerCase());

  const preContentMap = {};

  // Construire une map pageName -> contenu <pre>
  await Promise.all(ejsFiles.map(async (file) => {
    const baseName = path.parse(file).name.toLowerCase();
    const filePath = path.join(pagesDir, file);
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const preMatch = content.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
      let preContent = preMatch ? preMatch[1] : '';
      preContent = preContent.replace(/<[^>]+>/g, '').replace(/\s+/g, '').toLowerCase();
      preContentMap[baseName] = preContent;
    } catch (err) {
      console.error('Erreur lecture fichier', file, err);
    }
  }));

  const activeSet = new Set();
  const inactiveSet = new Set();

  // Parcourir toutes les pages pour extraire les mots et créer des liens
  await Promise.all(ejsFiles.map(async (file) => {
    const filePath = path.join(pagesDir, file);
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const text = content.replace(/<[^>]+>/g, '').toLowerCase();
      const words = text.match(/[\p{L}-]+/gu) || [];
      const pageSet = new Set(pageNames);

      words.forEach(word => {
        if (pageSet.has(word)) {
          if (preContentMap[word] === word) {
            inactiveSet.add(word);  // lien inactif (exact <pre>)
          } else {
            activeSet.add(word);    // lien actif
          }
        }
      });
    } catch (err) {
      console.error('Erreur lecture fichier', file, err);
    }
  }));

  const activeLinks = Array.from(activeSet).sort((a, b) =>
    a.localeCompare(b, 'fr', { sensitivity: 'base' })
  );
  const inactiveLinks = Array.from(inactiveSet).sort((a, b) =>
    a.localeCompare(b, 'fr', { sensitivity: 'base' })
  );

  return { activeLinks, inactiveLinks };
}

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PythonShell } from 'python-shell';
import favicon from 'serve-favicon';
import extractPageReferences from './js/extractPageReferences.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Dev : livereload ---
let liveReloadServer;
if (process.env.NODE_ENV !== 'production') {
  const livereload = await import('livereload');
  const connectLivereload = (await import('connect-livereload')).default;

  liveReloadServer = livereload.createServer();
  liveReloadServer.watch([
    path.join(process.cwd(), 'views'),
    path.join(process.cwd(), 'css'),
    path.join(process.cwd(), 'js')
  ]);

  app.use(connectLivereload());

  liveReloadServer.server.once('connection', () => {
    setTimeout(() => liveReloadServer.refresh('/'), 100);
  });

  // Watcher tous fichiers .ejs
  fs.watch(path.join(__dirname, 'views'), { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    if (filename.endsWith('.ejs') || filename.endsWith('.css') || filename.endsWith('.js')) {
      liveReloadServer.refresh('/');
    }
  });
}

// --- Favicon ---
app.use(favicon(path.join(__dirname, 'img', 'favicon.ico')));

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Static ---
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'img')));

// --- POST anagram ---
const forbiddenPatterns = [/\.js\.map$/, /\.css\.map$/];

app.post('/', async (req, res) => {
  try {
    const results = await PythonShell.run('py/anagram.py', { args: [req.body.str] });
    let output = results[0];
    if (output === '[]') output = '["oops"]';
    res.json(output);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- GET pages ---
app.get('/anagram', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/anagram.html'));
});

app.get('/', async (req, res) => {
  const title = 'index';
  try {
    const { activeLinks, inactiveLinks } = await extractPageReferences();
    res.render('index', { activeLinks, inactiveLinks, title });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

app.get('/:word', async (req, res) => {
  const word = req.params.word;

  if (forbiddenPatterns.some(r => r.test(word))) {
    return res.status(404).send('Not found');
  }

  const routePath = path.join(__dirname, `views/pages/${word}.ejs`);
  const title = word;

  try {
    const { activeLinks, inactiveLinks } = await extractPageReferences();

    // Crée la page dynamiquement si elle n'existe pas
    if (word !== 'index' && !fs.existsSync(routePath)) {
      const templateFile = path.join(__dirname, 'views/partials/template.ejs');
      const templateSource = fs.readFileSync(templateFile, 'utf8');
      fs.writeFileSync(routePath, templateSource.replace(/{{word}}/g, word));
      console.log('Nouvelle page créée:', word);
    }

    if (!fs.existsSync(routePath)) {
      return res.status(404).send('Page introuvable');
    }

    res.render(`pages/${word}`, { activeLinks, inactiveLinks, title });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// --- 404 ---
app.use((req, res) => res.status(404).send('Page introuvable'));

export default app;

import fs from 'fs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import abb from '../utils/abbreviations.js'
import cache from '../utils/cache.js'
import gh from '../utils/generateHash.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const bibleRouter = express.Router();

const loadBook = (version, book) => {
    const filePath = path.join(__dirname, '../..', 'data/bibles', version, 'books', `${abb.getBookFileName(book)}.json`);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

bibleRouter.get('/:version/:book', (req, res) => {
    const { version, book } = req.params;
    const data = loadBook(version, book);
    if (!data) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(data);
})

bibleRouter.get('/:version/:book/:chapter', (req, res) => {
    const { version, book, chapter } = req.params;

    const data = loadBook(version, book);
    if (!data) return res.status(404).json({ error: 'Libro no encontrado' });

    const chapterData = data.chapters.find(c => c.number === parseInt(chapter));
    if (!chapterData) return res.status(404).json({ error: 'Capítulo no encontrado' });

    res.json(chapterData);
})

bibleRouter.get('/:version/:book/:chapter/:verse', (req, res) => {
    const { version, book, chapter, verse } = req.params;

    const data = loadBook(version, book);
    if (!data) return res.status(404).json({ error: 'Libro no encontrado' });

    const chapterData = data.chapters.find(c => c.number === parseInt(chapter));
    if (!chapterData) return res.status(404).json({ error: 'Capítulo no encontrado' });

    const verseData = chapterData.verses.find(v => v.verse === parseInt(verse));
    if (!verseData) return res.status(404).json({ error: 'Versículo no encontrado' });

    res.json(verseData);
})

bibleRouter.get('/:version', async (req, res) => {
    const { version } = req.params;

    try {
        const localCache = cache.bibleCache.get(version);
        if (localCache) {
            const etag = gh.generateHash(JSON.stringify(localCache));
            res.setHeader('ETag', etag);
            return res.json(localCache);
        }

        const booksDir = path.join(__dirname, '../..', 'data/bibles', version, 'books');

        if (!fs.existsSync(booksDir)) return res.status(404).json({ error: 'Versión no encontrada' });

        const files = fs.readdirSync(booksDir).filter(file => file.endsWith(".json"))

        const books = await Promise.all(
            files.map(async file => {
                const filePath = path.join(booksDir, file);
                const content = await fs.promises.readFile(filePath, 'utf8');
                return JSON.parse(content);
            })
        );

        const antiguoTestamento = books.filter(book => book.testament === 'Antiguo Testamento');
        const nuevoTestamento = books.filter(book => book.testament === 'Nuevo Testamento');

        const response = {
            version,
            antiguoTestamento,
            nuevoTestamento
        };

        cache.bibleCache.set(version, response);

        const etag = gh.generateHash(JSON.stringify(response));
        res.setHeader('ETag', etag);

        res.json(response);
    } catch (error) {
        console.error('Error al cargar versión:', error);
        res.status(500).json({ error: 'Error interno' });
    }
})

export default bibleRouter;
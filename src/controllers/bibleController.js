import fs from 'fs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import abb from '../utils/abbreviations.js'

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
    const { version, book,chapter} = req.params;

    const data = loadBook(version, book);
    if (!data) return res.status(404).json({ error: 'Libro no encontrado' });

    const chapterData = data.chapters.find(c=>c.number === parseInt(chapter));
    if (!chapterData) return res.status(404).json({ error: 'Capítulo no encontrado' });

    res.json(chapterData);
})

bibleRouter.get('/:version/:book/:chapter/:verse', (req, res) => {
    const { version, book,chapter,verse} = req.params;

    const data = loadBook(version, book);
    if (!data) return res.status(404).json({ error: 'Libro no encontrado' });

    const chapterData = data.chapters.find(c=>c.number === parseInt(chapter));
    if (!chapterData) return res.status(404).json({ error: 'Capítulo no encontrado' });

     const verseData = chapterData.verses.find(v=>v.verse === parseInt(verse));
    if (!verseData) return res.status(404).json({ error: 'Versículo no encontrado' });

    res.json(verseData);
})


export default bibleRouter;
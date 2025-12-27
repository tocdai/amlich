import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const DB_FILE = path.join(__dirname, '../../data/events.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_FILE))) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}

// Initial DB if not exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

const getEvents = () => {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
};

const saveEvents = (events: any[]) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(events, null, 2));
};

router.get('/', (req, res) => {
    const events = getEvents();
    res.json(events);
});

router.post('/', (req, res) => {
    const events = getEvents();
    const newEvent = { ...req.body, id: Date.now().toString() };
    events.push(newEvent);
    saveEvents(events);
    res.status(201).json(newEvent);
});

router.delete('/:id', (req, res) => {
    let events = getEvents();
    const initialLength = events.length;
    events = events.filter((e: any) => e.id !== req.params.id);

    if (events.length === initialLength) {
        return res.status(404).json({ error: 'Event not found' });
    }

    saveEvents(events);
    res.status(204).send();
});

export default router;

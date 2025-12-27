import { Router } from 'express';
import { getLunarRange } from '../lib/lunar';

const router = Router();

router.get('/', (req, res) => {
    const { start, end } = req.query;
    if (!start || !end) {
        return res.status(400).json({ error: 'Start and end dates are required' });
    }

    // start and end should be YYYY-MM-DD
    try {
        const data = getLunarRange(new Date(start as string), new Date(end as string));
        res.json(data);
    } catch (e) {
        res.status(400).json({ error: 'Invalid date format' });
    }
});

export default router;

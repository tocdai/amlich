import express from 'express';
import cors from 'cors';
import lunarRoutes from './routes/lunar';
import eventRoutes from './routes/events';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/lunar', lunarRoutes);
app.use('/api/events', eventRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});

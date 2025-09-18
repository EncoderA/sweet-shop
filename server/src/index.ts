import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import authRoutes from './routes/authRoutes';
import sweetRoutes from './routes/sweetRoutes';
import uploadRoutes from './routes/uploadRoutes';

const db = drizzle(process.env.DATABASE_URL!);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'Sweet Shop API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(PORT, () => {
  console.log(`🍭 Sweet Shop Server is running on port ${PORT}`);
});

export default app;

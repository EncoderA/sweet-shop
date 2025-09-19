import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import authRoutes from './routes/authRoutes';
import sweetRoutes from './routes/sweetRoutes';
import uploadRoutes from './routes/uploadRoutes';

// Create Express app
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Only use static file serving in development
if (process.env.NODE_ENV === 'development') {
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
}

app.get('/', (req, res) => {
  res.json({ message: 'Sweet Shop API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
app.use('/api/upload', uploadRoutes);

// For local development
if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🍭 Sweet Shop Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless function
export default app;

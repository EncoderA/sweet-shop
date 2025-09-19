import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { drizzle } from 'drizzle-orm/node-postgres';
import authRoutes from './routes/authRoutes';
import sweetRoutes from './routes/sweetRoutes';
import uploadRoutes from './routes/uploadRoutes';
import path from 'path';

const app = express();

const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Sweet Shop API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
app.use('/api/upload', uploadRoutes);

// Serve static uploads directory (images)
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// For local development only
if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🍭 Sweet Shop Server is running on port ${PORT}`);
  });
}

export default app;

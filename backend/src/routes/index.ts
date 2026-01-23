import { Router } from 'express';
import authRoutes from './auth';
import facultyRoutes from './faculty.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Sports Week API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Auth routes
router.use('/auth', authRoutes);

// Faculty routes
router.use('/faculties', facultyRoutes);

export default router;

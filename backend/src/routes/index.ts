import { Router } from 'express';
import authRoutes from './auth';
import facultyRoutes from './faculty.routes';
import userRoutes from './user.routes';

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

// User routes
router.use('/users', userRoutes);

export default router;

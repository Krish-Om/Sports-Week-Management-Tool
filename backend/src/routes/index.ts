import { Router } from 'express';
import authRoutes from './auth';
import facultyRoutes from './faculty.routes';
import userRoutes from './user.routes';
import gameRoutes from './game.routes';
import teamRoutes from './team.routes';
import playerRoutes from './player.routes';
import matchRoutes from './match.routes';
import matchParticipantRoutes from './match-participant.routes';
import pointsRoutes from './points.routes';

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

// Game routes
router.use('/games', gameRoutes);

// Team routes
router.use('/teams', teamRoutes);

// Player routes
router.use('/players', playerRoutes);

// Match routes
router.use('/matches', matchRoutes);

// Match Participant routes
router.use('/match-participants', matchParticipantRoutes);

// Points routes
router.use('/points', pointsRoutes);

export default router;

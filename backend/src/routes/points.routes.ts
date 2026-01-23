import type { Request, Response } from 'express';
import { Router } from 'express';
import { PointsService } from '../services/points.service';
import { asyncHandler } from '../middleware/error';
import { authenticateToken } from '../middleware/auth';
import type { ApiResponse } from '../types/api';
import { io } from '../index';

const router = Router();

// Get faculty leaderboard (public)
router.get('/leaderboard', asyncHandler(async (req: Request, res: Response) => {
  const leaderboard = await PointsService.getLeaderboard();
  
  const response: ApiResponse<typeof leaderboard> = {
    success: true,
    data: leaderboard,
  };
  
  res.json(response);
}));

// Get detailed leaderboard with statistics (public)
router.get('/leaderboard/detailed', asyncHandler(async (req: Request, res: Response) => {
  const detailed = await PointsService.getDetailedLeaderboard();
  
  const response: ApiResponse<typeof detailed> = {
    success: true,
    data: detailed,
  };
  
  res.json(response);
}));

// Get points history for a faculty (public)
router.get('/faculty/:facultyId/history', asyncHandler(async (req: Request, res: Response) => {
  const facultyId = Array.isArray(req.params.facultyId) ? req.params.facultyId[0] : req.params.facultyId;
  
  if (!facultyId) {
    return res.status(400).json({
      success: false,
      error: 'Faculty ID is required',
    });
  }

  const history = await PointsService.getFacultyPointsHistory(facultyId);
  
  const response: ApiResponse<typeof history> = {
    success: true,
    data: history,
  };
  
  res.json(response);
}));

// Calculate points for a match (admin only)
router.post(
  '/calculate/:matchId',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const userRole = (req as any).user?.role;

    if (userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required',
      });
    }

    const matchId = Array.isArray(req.params.matchId) ? req.params.matchId[0] : req.params.matchId;

    if (!matchId) {
      return res.status(400).json({
        success: false,
        error: 'Match ID is required',
      });
    }

    try {
      const calculation = await PointsService.calculateMatchPoints(matchId);

      if (!calculation) {
        return res.status(400).json({
          success: false,
          error: 'Match is not finished or not found',
        });
      }

      const response: ApiResponse<typeof calculation> = {
        success: true,
        data: calculation,
        message: 'Points calculated successfully',
      };

      res.json(response);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to calculate points',
      });
    }
  })
);

// Apply calculated points to match (admin only)
router.post(
  '/apply/:matchId',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const userRole = (req as any).user?.role;

    if (userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required',
      });
    }

    const matchId = Array.isArray(req.params.matchId) ? req.params.matchId[0] : req.params.matchId;

    if (!matchId) {
      return res.status(400).json({
        success: false,
        error: 'Match ID is required',
      });
    }

    try {
      const calculation = await PointsService.calculateMatchPoints(matchId);

      if (!calculation) {
        return res.status(400).json({
          success: false,
          error: 'Match is not finished or not found',
        });
      }

      await PointsService.applyPoints(calculation);

      // Emit Socket.io event for leaderboard update
      io.emit('leaderboardUpdate', {
        matchId,
        winnerFacultyId: calculation.winnerFacultyId,
        winnerFacultyName: calculation.winnerFacultyName,
        pointsAwarded: calculation.pointsAwarded,
        gameWeight: calculation.gameWeight,
        participantResults: calculation.participantResults,
        timestamp: new Date().toISOString(),
      });

      const response: ApiResponse<typeof calculation> = {
        success: true,
        data: calculation,
        message: 'Points applied successfully and leaderboard updated',
      };

      res.json(response);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to apply points',
      });
    }
  })
);

export default router;

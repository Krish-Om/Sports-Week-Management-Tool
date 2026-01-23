import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { MatchService } from '../services/match.service';
import { asyncHandler } from '../middleware/error';
import type { ApiResponse } from '../types/api';
import type { MatchParticipant } from '../db/schema';

const router = Router();

// Update participant score (Manager only)
router.put('/:participantId', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { participantId } = req.params;
  const { score, pointsEarned } = req.body;

  if (typeof score !== 'number' || score < 0) {
    return res.status(400).json({ error: 'Invalid score value' });
  }

  const updatedParticipant = await MatchService.updateParticipantScore(
    participantId,
    score,
    pointsEarned || 0
  );

  const response: ApiResponse<MatchParticipant> = {
    success: true,
    data: updatedParticipant,
  };

  res.status(200).json(response);
}));

export default router;

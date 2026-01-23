import { Router, Request, Response } from 'express';
import { MatchService } from '../services/match.service';
import { GameService } from '../services/game.service';
import { TeamService } from '../services/team.service';
import { PlayerService } from '../services/player.service';
import { asyncHandler } from '../middleware/error';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import type { ApiResponse } from '../types/api';
import type { Match, NewMatch } from '../db/schema';

const router = Router();

// Get all matches (public)
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const matches = await MatchService.getAll();
  
  const response: ApiResponse<Match[]> = {
    success: true,
    data: matches,
  };
  
  res.json(response);
}));

// Get match by ID with participants (public)
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const match = await MatchService.getById(req.params.id);
  
  if (!match) {
    return res.status(404).json({
      success: false,
      error: 'Match not found',
    });
  }

  const participants = await MatchService.getParticipantsWithDetails(req.params.id);
  
  const response: ApiResponse<any> = {
    success: true,
    data: { ...match, participants },
  };
  
  res.json(response);
}));

// Create match (admin only)
router.post('/', authenticateToken, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { gameId, startTime, venue, status, participants } = req.body;

  // Validate required fields
  if (!gameId || !startTime || !venue) {
    return res.status(400).json({
      success: false,
      error: 'GameId, startTime, and venue are required',
    });
  }

  // Verify game exists
  const game = await GameService.getById(gameId);
  if (!game) {
    return res.status(400).json({
      success: false,
      error: 'Game not found',
    });
  }

  // Create match
  const match = await MatchService.create({
    gameId,
    startTime: new Date(startTime),
    venue,
    status: status || 'UPCOMING',
  });

  // Add participants if provided
  if (participants && Array.isArray(participants) && participants.length > 0) {
    for (const participant of participants) {
      if (participant.teamId) {
        const team = await TeamService.getById(participant.teamId);
        if (!team) {
          continue;
        }
      }
      if (participant.playerId) {
        const player = await PlayerService.getById(participant.playerId);
        if (!player) {
          continue;
        }
      }

      await MatchService.addParticipant({
        matchId: match.id,
        teamId: participant.teamId || null,
        playerId: participant.playerId || null,
        score: 0,
        pointsEarned: 0,
      });
    }
  }

  const matchParticipants = await MatchService.getParticipantsWithDetails(match.id);
  
  const response: ApiResponse<any> = {
    success: true,
    data: { ...match, participants: matchParticipants },
    message: 'Match created successfully',
  };
  
  res.status(201).json(response);
}));

// Update match (admin only)
router.put('/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { gameId, startTime, venue, status, participants, winnerId } = req.body;
  const userId = (req as any).user?.id;
  const userRole = (req as any).user?.role;

  // Check if match exists
  const existingMatch = await MatchService.getById(req.params.id);
  if (!existingMatch) {
    return res.status(404).json({
      success: false,
      error: 'Match not found',
    });
  }

  // Authorization: Only admins can change game/venue/startTime. Managers can only update status and winnerId
  if (userRole !== 'ADMIN') {
    // Managers can only update status and winnerId for their assigned games
    const game = await GameService.getById(existingMatch.gameId);
    
    if (!game || game.managerId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only update matches for your assigned games',
      });
    }

    // Managers can only update status and winnerId
    if (gameId !== undefined || startTime !== undefined || venue !== undefined) {
      return res.status(403).json({
        success: false,
        error: 'Managers can only update match status and winner',
      });
    }
  }

  // Verify game if being updated (admin only)
  if (gameId) {
    const game = await GameService.getById(gameId);
    if (!game) {
      return res.status(400).json({
        success: false,
        error: 'Game not found',
      });
    }
  }

  // Validate status
  if (status && !['UPCOMING', 'LIVE', 'FINISHED'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Status must be UPCOMING, LIVE, or FINISHED',
    });
  }

  const updateData: Partial<NewMatch> = {};
  if (gameId !== undefined) updateData.gameId = gameId;
  if (startTime !== undefined) updateData.startTime = new Date(startTime);
  if (venue !== undefined) updateData.venue = venue;
  if (status !== undefined) updateData.status = status as any;
  if (winnerId !== undefined) updateData.winnerId = winnerId;

  const match = await MatchService.update(req.params.id, updateData);

  // Update participants if provided
  if (participants && Array.isArray(participants)) {
    // Delete existing participants
    await MatchService.deleteParticipants(req.params.id);

    // Add new participants
    for (const participant of participants) {
      if (participant.teamId) {
        const team = await TeamService.getById(participant.teamId);
        if (!team) {
          continue;
        }
      }
      if (participant.playerId) {
        const player = await PlayerService.getById(participant.playerId);
        if (!player) {
          continue;
        }
      }

      await MatchService.addParticipant({
        matchId: match.id,
        teamId: participant.teamId || null,
        playerId: participant.playerId || null,
        score: participant.score || 0,
        pointsEarned: participant.pointsEarned || 0,
      });
    }
  }

  const matchParticipants = await MatchService.getParticipantsWithDetails(match.id);
  
  const response: ApiResponse<any> = {
    success: true,
    data: { ...match, participants: matchParticipants },
    message: 'Match updated successfully',
  };
  
  res.json(response);
}));

// Delete match (admin only)
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const match = await MatchService.getById(req.params.id);
  
  if (!match) {
    return res.status(404).json({
      success: false,
      error: 'Match not found',
    });
  }

  await MatchService.delete(req.params.id);
  
  const response: ApiResponse = {
    success: true,
    message: 'Match deleted successfully',
  };
  
  res.json(response);
}));

export default router;

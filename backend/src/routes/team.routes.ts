import { Router } from 'express';
import { TeamService } from '../services/team.service';
import { FacultyService } from '../services/faculty.service';
import { GameService } from '../services/game.service';
import { asyncHandler } from '../middleware/error';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import type { ApiResponse } from '../types/api';
import type { Team, NewTeam } from '../db/schema';

const router = Router();

// Get all teams (public)
router.get('/', asyncHandler(async (req, res) => {
  const teams = await TeamService.getAll();
  
  const response: ApiResponse<Team[]> = {
    success: true,
    data: teams,
  };
  
  res.json(response);
}));

// Get team by ID (public)
router.get('/:id', asyncHandler(async (req, res) => {
  const team = await TeamService.getById(req.params.id);
  
  if (!team) {
    return res.status(404).json({
      success: false,
      error: 'Team not found',
    });
  }
  
  const response: ApiResponse<Team> = {
    success: true,
    data: team,
  };
  
  res.json(response);
}));

// Create team (admin only)
router.post('/', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { name, facultyId, gameId } = req.body;

  // Validate required fields
  if (!name || !facultyId || !gameId) {
    return res.status(400).json({
      success: false,
      error: 'Name, facultyId, and gameId are required',
    });
  }

  // Verify faculty exists
  const faculty = await FacultyService.getById(facultyId);
  if (!faculty) {
    return res.status(400).json({
      success: false,
      error: 'Faculty not found',
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

  // Check for duplicate team
  const isDuplicate = await TeamService.checkDuplicate(facultyId, gameId, name);
  if (isDuplicate) {
    return res.status(400).json({
      success: false,
      error: 'A team with this name already exists for this faculty and game',
    });
  }

  const team = await TeamService.create({
    name,
    facultyId,
    gameId,
  });
  
  const response: ApiResponse<Team> = {
    success: true,
    data: team,
    message: 'Team created successfully',
  };
  
  res.status(201).json(response);
}));

// Update team (admin only)
router.put('/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { name, facultyId, gameId } = req.body;

  // Check if team exists
  const existingTeam = await TeamService.getById(req.params.id);
  if (!existingTeam) {
    return res.status(404).json({
      success: false,
      error: 'Team not found',
    });
  }

  // Verify faculty if being updated
  if (facultyId) {
    const faculty = await FacultyService.getById(facultyId);
    if (!faculty) {
      return res.status(400).json({
        success: false,
        error: 'Faculty not found',
      });
    }
  }

  // Verify game if being updated
  if (gameId) {
    const game = await GameService.getById(gameId);
    if (!game) {
      return res.status(400).json({
        success: false,
        error: 'Game not found',
      });
    }
  }

  // Check for duplicate if name, faculty, or game is being changed
  if (name || facultyId || gameId) {
    const checkFacultyId = facultyId || existingTeam.facultyId;
    const checkGameId = gameId || existingTeam.gameId;
    const checkName = name || existingTeam.name;

    const isDuplicate = await TeamService.checkDuplicate(checkFacultyId, checkGameId, checkName);
    if (isDuplicate && (name !== existingTeam.name || facultyId !== existingTeam.facultyId || gameId !== existingTeam.gameId)) {
      return res.status(400).json({
        success: false,
        error: 'A team with this name already exists for this faculty and game',
      });
    }
  }

  const updateData: Partial<NewTeam> = {};
  if (name !== undefined) updateData.name = name;
  if (facultyId !== undefined) updateData.facultyId = facultyId;
  if (gameId !== undefined) updateData.gameId = gameId;

  const team = await TeamService.update(req.params.id, updateData);
  
  const response: ApiResponse<Team> = {
    success: true,
    data: team,
    message: 'Team updated successfully',
  };
  
  res.json(response);
}));

// Delete team (admin only)
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const team = await TeamService.getById(req.params.id);
  
  if (!team) {
    return res.status(404).json({
      success: false,
      error: 'Team not found',
    });
  }

  await TeamService.delete(req.params.id);
  
  const response: ApiResponse = {
    success: true,
    message: 'Team deleted successfully',
  };
  
  res.json(response);
}));

export default router;

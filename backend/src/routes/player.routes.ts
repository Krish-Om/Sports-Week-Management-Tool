import { Router } from 'express';
import { PlayerService } from '../services/player.service';
import { FacultyService } from '../services/faculty.service';
import { asyncHandler } from '../middleware/error';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import type { ApiResponse } from '../types/api';
import type { Player, NewPlayer } from '../db/schema';

const router = Router();

// Get all players (public)
router.get('/', asyncHandler(async (req, res) => {
  const players = await PlayerService.getAll();
  
  const response: ApiResponse<Player[]> = {
    success: true,
    data: players,
  };
  
  res.json(response);
}));

// Get player by ID (public)
router.get('/:id', asyncHandler(async (req, res) => {
  const player = await PlayerService.getById(req.params.id);
  
  if (!player) {
    return res.status(404).json({
      success: false,
      error: 'Player not found',
    });
  }
  
  const response: ApiResponse<Player> = {
    success: true,
    data: player,
  };
  
  res.json(response);
}));

// Create player (admin only)
router.post('/', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { name, facultyId, semester } = req.body;

  // Validate required fields
  if (!name || !facultyId) {
    return res.status(400).json({
      success: false,
      error: 'Name and facultyId are required',
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

  const player = await PlayerService.create({
    name,
    facultyId,
    semester: semester || null,
  });
  
  const response: ApiResponse<Player> = {
    success: true,
    data: player,
    message: 'Player created successfully',
  };
  
  res.status(201).json(response);
}));

// Update player (admin only)
router.put('/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { name, facultyId, semester } = req.body;

  // Check if player exists
  const existingPlayer = await PlayerService.getById(req.params.id);
  if (!existingPlayer) {
    return res.status(404).json({
      success: false,
      error: 'Player not found',
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

  const updateData: Partial<NewPlayer> = {};
  if (name !== undefined) updateData.name = name;
  if (facultyId !== undefined) updateData.facultyId = facultyId;
  if (semester !== undefined) updateData.semester = semester;

  const player = await PlayerService.update(req.params.id, updateData);
  
  const response: ApiResponse<Player> = {
    success: true,
    data: player,
    message: 'Player updated successfully',
  };
  
  res.json(response);
}));

// Delete player (admin only)
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const player = await PlayerService.getById(req.params.id);
  
  if (!player) {
    return res.status(404).json({
      success: false,
      error: 'Player not found',
    });
  }

  await PlayerService.delete(req.params.id);
  
  const response: ApiResponse = {
    success: true,
    message: 'Player deleted successfully',
  };
  
  res.json(response);
}));

export default router;

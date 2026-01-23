import { Router } from 'express';
import { GameService } from '../services/game.service';
import { UserService } from '../services/user.service';
import { asyncHandler } from '../middleware/error';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import type { ApiResponse } from '../types/api';
import type { Game, NewGame } from '../db/schema';

const router = Router();

// Get all games (public)
router.get('/', asyncHandler(async (req, res) => {
  const games = await GameService.getAll();
  
  const response: ApiResponse<Game[]> = {
    success: true,
    data: games,
  };
  
  res.json(response);
}));

// Get game by ID (public)
router.get('/:id', asyncHandler(async (req, res) => {
  const game = await GameService.getById(req.params.id);
  
  if (!game) {
    return res.status(404).json({
      success: false,
      error: 'Game not found',
    });
  }
  
  const response: ApiResponse<Game> = {
    success: true,
    data: game,
  };
  
  res.json(response);
}));

// Create game (admin only)
router.post('/', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { name, type, pointWeight, managerId } = req.body;

  // Validate required fields
  if (!name || !type) {
    return res.status(400).json({
      success: false,
      error: 'Name and type are required',
    });
  }

  // Validate game type
  if (!['TEAM', 'INDIVIDUAL'].includes(type)) {
    return res.status(400).json({
      success: false,
      error: 'Type must be either TEAM or INDIVIDUAL',
    });
  }

  // If manager is assigned, verify they exist
  if (managerId) {
    const manager = await UserService.findById(managerId);
    if (!manager) {
      return res.status(400).json({
        success: false,
        error: 'Manager not found',
      });
    }
  }

  const game = await GameService.create({
    name,
    type,
    pointWeight: pointWeight || 1,
    managerId: managerId || null,
  });
  
  const response: ApiResponse<Game> = {
    success: true,
    data: game,
    message: 'Game created successfully',
  };
  
  res.status(201).json(response);
}));

// Update game (admin only)
router.put('/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { name, type, pointWeight, managerId } = req.body;

  // Check if game exists
  const existingGame = await GameService.getById(req.params.id);
  if (!existingGame) {
    return res.status(404).json({
      success: false,
      error: 'Game not found',
    });
  }

  // Validate game type if provided
  if (type && !['TEAM', 'INDIVIDUAL'].includes(type)) {
    return res.status(400).json({
      success: false,
      error: 'Type must be either TEAM or INDIVIDUAL',
    });
  }

  // If manager is being updated, verify they exist
  if (managerId !== undefined && managerId !== null) {
    const manager = await UserService.findById(managerId);
    if (!manager) {
      return res.status(400).json({
        success: false,
        error: 'Manager not found',
      });
    }
  }

  const updateData: Partial<NewGame> = {};
  if (name !== undefined) updateData.name = name;
  if (type !== undefined) updateData.type = type;
  if (pointWeight !== undefined) updateData.pointWeight = pointWeight;
  if (managerId !== undefined) updateData.managerId = managerId;

  const game = await GameService.update(req.params.id, updateData);
  
  const response: ApiResponse<Game> = {
    success: true,
    data: game,
    message: 'Game updated successfully',
  };
  
  res.json(response);
}));

// Delete game (admin only)
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const game = await GameService.getById(req.params.id);
  
  if (!game) {
    return res.status(404).json({
      success: false,
      error: 'Game not found',
    });
  }

  await GameService.delete(req.params.id);
  
  const response: ApiResponse = {
    success: true,
    message: 'Game deleted successfully',
  };
  
  res.json(response);
}));

export default router;

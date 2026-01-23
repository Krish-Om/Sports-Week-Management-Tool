import { Router } from 'express';
import { FacultyService } from '../services/faculty.service';
import { PointsService } from '../services/points.service';
import { asyncHandler } from '../middleware/error';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import type { ApiResponse } from '../types/api';
import type { Faculty, NewFaculty } from '../db/schema';

const router = Router();

// Get all faculties (public)
router.get('/', asyncHandler(async (req, res) => {
  const faculties = await FacultyService.getAll();
  
  const response: ApiResponse<Faculty[]> = {
    success: true,
    data: faculties,
  };
  
  res.json(response);
}));

// Get faculty by ID (public)
router.get('/:id', asyncHandler(async (req, res) => {
  const faculty = await FacultyService.getById(req.params.id);
  
  const response: ApiResponse<Faculty> = {
    success: true,
    data: faculty,
  };
  
  res.json(response);
}));

// Create faculty (admin only)
router.post('/', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const faculty = await FacultyService.create(req.body as NewFaculty);
  
  const response: ApiResponse<Faculty> = {
    success: true,
    data: faculty,
    message: 'Faculty created successfully',
  };
  
  res.status(201).json(response);
}));

// Update faculty (admin only)
router.put('/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const faculty = await FacultyService.update(req.params.id, req.body);
  
  const response: ApiResponse<Faculty> = {
    success: true,
    data: faculty,
    message: 'Faculty updated successfully',
  };
  
  res.json(response);
}));

// Delete faculty (admin only)
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  await FacultyService.delete(req.params.id);
  
  const response: ApiResponse = {
    success: true,
    message: 'Faculty deleted successfully',
  };
  
  res.json(response);
}));

// Get leaderboard (public)
router.get('/leaderboard/all', asyncHandler(async (req, res) => {
  const leaderboard = await PointsService.getLeaderboard();
  
  const response: ApiResponse<Faculty[]> = {
    success: true,
    data: leaderboard,
  };
  
  res.json(response);
}));

export default router;

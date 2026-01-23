import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { env } from '../config/env';
import { asyncHandler, AppError } from '../middleware/error';
import type { LoginRequest, LoginResponse, ApiResponse } from '../types/api';

const router = Router();

router.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body as LoginRequest;

  if (!username || !password) {
    throw new AppError(400, 'Username and password required');
  }

  // Find user
  const user = await UserService.findByUsername(username);

  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new AppError(401, 'Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const response: ApiResponse<LoginResponse> = {
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    },
  };

  res.json(response);
}));

export default router;

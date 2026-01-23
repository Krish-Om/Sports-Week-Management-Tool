import { Router } from 'express';
import { UserService } from '../services/user.service';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

// GET /api/users - Get all users (Admin only)
router.get('/', requireAdmin, asyncHandler(async (req, res) => {
  const users = await UserService.getAll();
  
  // Remove password from response
  const usersWithoutPassword = users.map(({ password, ...user }) => user);
  
  res.json({
    success: true,
    data: usersWithoutPassword,
  });
}));

// GET /api/users/:id - Get user by ID (Admin only)
router.get('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserService.findById(id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  const { password, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    data: userWithoutPassword,
  });
}));

// POST /api/users - Create new user (Admin only)
router.post('/', requireAdmin, asyncHandler(async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Username and password are required',
    });
  }

  // Check if username already exists
  const existingUser = await UserService.findByUsername(username);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: 'Username already exists',
    });
  }

  const newUser = await UserService.create({
    username,
    password,
    role: role || 'MANAGER',
  });

  const { password: _, ...userWithoutPassword } = newUser;

  res.status(201).json({
    success: true,
    data: userWithoutPassword,
    message: 'User created successfully',
  });
}));

// PUT /api/users/:id - Update user (Admin only)
router.put('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;

  const existingUser = await UserService.findById(id);
  if (!existingUser) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  // If updating username, check it's not taken
  if (username && username !== existingUser.username) {
    const userWithSameUsername = await UserService.findByUsername(username);
    if (userWithSameUsername) {
      return res.status(409).json({
        success: false,
        error: 'Username already exists',
      });
    }
  }

  const updateData: any = {};
  if (username) updateData.username = username;
  if (password) updateData.password = password;
  if (role) updateData.role = role;

  const updatedUser = await UserService.update(id, updateData);

  const { password: _, ...userWithoutPassword } = updatedUser;

  res.json({
    success: true,
    data: userWithoutPassword,
    message: 'User updated successfully',
  });
}));

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await UserService.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  // Prevent deleting admin user (optional safeguard)
  if (user.role === 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Cannot delete admin user',
    });
  }

  await UserService.delete(id);

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
}));

export default router;

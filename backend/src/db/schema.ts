import { pgTable, uuid, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const roleEnum = pgEnum('role', ['ADMIN', 'MANAGER']);
export const matchStatusEnum = pgEnum('match_status', ['UPCOMING', 'LIVE', 'FINISHED']);
export const gameTypeEnum = pgEnum('game_type', ['TEAM', 'INDIVIDUAL']);

// Faculty Table
export const faculties = pgTable('faculties', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  totalPoints: integer('total_points').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').notNull().default('MANAGER'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Game Table
export const games = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  type: gameTypeEnum('type').notNull(),
  pointWeight: integer('point_weight').notNull().default(1),
  managerId: uuid('manager_id').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Player Table
export const players = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  facultyId: uuid('faculty_id').notNull().references(() => faculties.id, { onDelete: 'cascade' }),
  semester: text('semester'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Team Table
export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  facultyId: uuid('faculty_id').notNull().references(() => faculties.id, { onDelete: 'cascade' }),
  gameId: uuid('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Match Table
export const matches = pgTable('matches', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameId: uuid('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  startTime: timestamp('start_time').notNull(),
  venue: text('venue').notNull(),
  status: matchStatusEnum('status').notNull().default('UPCOMING'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Match Participant Table
export const matchParticipants = pgTable('match_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  matchId: uuid('match_id').notNull().references(() => matches.id, { onDelete: 'cascade' }),
  teamId: uuid('team_id').references(() => teams.id, { onDelete: 'cascade' }),
  playerId: uuid('player_id').references(() => players.id, { onDelete: 'cascade' }),
  score: integer('score').notNull().default(0),
  pointsEarned: integer('points_earned').notNull().default(0),
});

// Type exports
export type Faculty = typeof faculties.$inferSelect;
export type NewFaculty = typeof faculties.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;

export type MatchParticipant = typeof matchParticipants.$inferSelect;
export type NewMatchParticipant = typeof matchParticipants.$inferInsert;

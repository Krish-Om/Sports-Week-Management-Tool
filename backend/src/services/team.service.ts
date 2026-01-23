import { db, schema } from '../config/database';
import { eq, and } from 'drizzle-orm';
import type { Team, NewTeam } from '../db/schema';

export class TeamService {
  static async getAll(): Promise<Team[]> {
    return await db.select().from(schema.teams);
  }

  static async getById(id: string): Promise<Team | undefined> {
    const [team] = await db
      .select()
      .from(schema.teams)
      .where(eq(schema.teams.id, id))
      .limit(1);
    
    return team;
  }

  static async create(data: NewTeam): Promise<Team> {
    const [team] = await db
      .insert(schema.teams)
      .values(data)
      .returning();
    
    return team;
  }

  static async update(id: string, data: Partial<NewTeam>): Promise<Team> {
    const [team] = await db
      .update(schema.teams)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.teams.id, id))
      .returning();
    
    return team;
  }

  static async delete(id: string): Promise<void> {
    await db
      .delete(schema.teams)
      .where(eq(schema.teams.id, id));
  }

  static async getByFacultyId(facultyId: string): Promise<Team[]> {
    return await db
      .select()
      .from(schema.teams)
      .where(eq(schema.teams.facultyId, facultyId));
  }

  static async getByGameId(gameId: string): Promise<Team[]> {
    return await db
      .select()
      .from(schema.teams)
      .where(eq(schema.teams.gameId, gameId));
  }

  static async checkDuplicate(facultyId: string, gameId: string, name: string): Promise<boolean> {
    const [existing] = await db
      .select()
      .from(schema.teams)
      .where(
        and(
          eq(schema.teams.facultyId, facultyId),
          eq(schema.teams.gameId, gameId),
          eq(schema.teams.name, name)
        )
      )
      .limit(1);
    
    return !!existing;
  }
}

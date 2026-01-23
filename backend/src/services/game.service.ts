import { db, schema } from '../config/database';
import { eq } from 'drizzle-orm';
import type { Game, NewGame } from '../db/schema';

export class GameService {
  static async getAll(): Promise<Game[]> {
    return await db.select().from(schema.games);
  }

  static async getById(id: string): Promise<Game | undefined> {
    const [game] = await db
      .select()
      .from(schema.games)
      .where(eq(schema.games.id, id))
      .limit(1);
    
    return game;
  }

  static async create(data: NewGame): Promise<Game> {
    const [game] = await db
      .insert(schema.games)
      .values(data)
      .returning();
    
    return game;
  }

  static async update(id: string, data: Partial<NewGame>): Promise<Game> {
    const [game] = await db
      .update(schema.games)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.games.id, id))
      .returning();
    
    return game;
  }

  static async delete(id: string): Promise<void> {
    await db
      .delete(schema.games)
      .where(eq(schema.games.id, id));
  }

  static async getByManagerId(managerId: string): Promise<Game[]> {
    return await db
      .select()
      .from(schema.games)
      .where(eq(schema.games.managerId, managerId));
  }
}

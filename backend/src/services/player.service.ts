import { db, schema } from '../config/database';
import { eq } from 'drizzle-orm';
import type { Player, NewPlayer } from '../db/schema';

export class PlayerService {
  static async getAll(): Promise<Player[]> {
    return await db.select().from(schema.players);
  }

  static async getById(id: string): Promise<Player | undefined> {
    const [player] = await db
      .select()
      .from(schema.players)
      .where(eq(schema.players.id, id))
      .limit(1);
    
    return player;
  }

  static async create(data: NewPlayer): Promise<Player> {
    const [player] = await db
      .insert(schema.players)
      .values(data)
      .returning();
    
    return player;
  }

  static async update(id: string, data: Partial<NewPlayer>): Promise<Player> {
    const [player] = await db
      .update(schema.players)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.players.id, id))
      .returning();
    
    return player;
  }

  static async delete(id: string): Promise<void> {
    await db
      .delete(schema.players)
      .where(eq(schema.players.id, id));
  }

  static async getByFacultyId(facultyId: string): Promise<Player[]> {
    return await db
      .select()
      .from(schema.players)
      .where(eq(schema.players.facultyId, facultyId));
  }
}

import { db, schema } from '../config/database';
import { eq } from 'drizzle-orm';
import type { Match, NewMatch, MatchParticipant, NewMatchParticipant } from '../db/schema';

export class MatchService {
  static async getAll(): Promise<Match[]> {
    return await db.select().from(schema.matches);
  }

  static async getById(id: string): Promise<Match | undefined> {
    const [match] = await db
      .select()
      .from(schema.matches)
      .where(eq(schema.matches.id, id))
      .limit(1);
    
    return match;
  }

  static async create(data: NewMatch): Promise<Match> {
    const [match] = await db
      .insert(schema.matches)
      .values(data)
      .returning();
    
    return match;
  }

  static async update(id: string, data: Partial<NewMatch>): Promise<Match> {
    const [match] = await db
      .update(schema.matches)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.matches.id, id))
      .returning();
    
    return match;
  }

  static async delete(id: string): Promise<void> {
    await db
      .delete(schema.matches)
      .where(eq(schema.matches.id, id));
  }

  static async getByGameId(gameId: string): Promise<Match[]> {
    return await db
      .select()
      .from(schema.matches)
      .where(eq(schema.matches.gameId, gameId));
  }

  static async getByStatus(status: string): Promise<Match[]> {
    return await db
      .select()
      .from(schema.matches)
      .where(eq(schema.matches.status, status as any));
  }

  // Match Participant methods
  static async addParticipant(data: NewMatchParticipant): Promise<MatchParticipant> {
    const [participant] = await db
      .insert(schema.matchParticipants)
      .values(data)
      .returning();
    
    return participant;
  }

  static async getParticipants(matchId: string): Promise<MatchParticipant[]> {
    return await db
      .select()
      .from(schema.matchParticipants)
      .where(eq(schema.matchParticipants.matchId, matchId));
  }

  static async deleteParticipants(matchId: string): Promise<void> {
    await db
      .delete(schema.matchParticipants)
      .where(eq(schema.matchParticipants.matchId, matchId));
  }
}

import { db, schema } from '../config/database';
import { eq } from 'drizzle-orm';
import type { Match, NewMatch, MatchParticipant, NewMatchParticipant } from '../db/schema';

export class MatchService {
  static async getAll(): Promise<Match[]> {
    return await db.select().from(schema.matches);
  }

  static async getAllWithDetails(): Promise<any[]> {
    const matches = await this.getAll();

    // Enrich each match with game details and participants
    const enrichedMatches = await Promise.all(
      matches.map(async (match) => {
        // Fetch game details
        const [gameData] = await db
          .select()
          .from(schema.games)
          .where(eq(schema.games.id, match.gameId))
          .limit(1);

        // Fetch participants with details
        const participants = await this.getParticipantsWithDetails(match.id);

        return {
          ...match,
          game: gameData || null,
          participants,
        };
      })
    );

    return enrichedMatches;
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
    
    if (!match) {
      throw new Error('Failed to create match');
    }
    return match;
  }

  static async update(id: string, data: Partial<NewMatch>): Promise<Match> {
    const [match] = await db
      .update(schema.matches)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.matches.id, id))
      .returning();
    
    if (!match) {
      throw new Error('Failed to update match');
    }
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
    
    if (!participant) {
      throw new Error('Failed to add participant');
    }
    return participant;
  }

  static async getParticipants(matchId: string): Promise<MatchParticipant[]> {
    return await db
      .select()
      .from(schema.matchParticipants)
      .where(eq(schema.matchParticipants.matchId, matchId));
  }

  static async getParticipantsWithDetails(matchId: string): Promise<any[]> {
    const participants = await db
      .select()
      .from(schema.matchParticipants)
      .where(eq(schema.matchParticipants.matchId, matchId));

    // Fetch team and player details for each participant
    const enrichedParticipants = await Promise.all(
      participants.map(async (participant) => {
        let team = null;
        let player = null;

        if (participant.teamId) {
          const [teamData] = await db
            .select()
            .from(schema.teams)
            .where(eq(schema.teams.id, participant.teamId))
            .limit(1);
          team = teamData || null;
        }

        if (participant.playerId) {
          const [playerData] = await db
            .select()
            .from(schema.players)
            .where(eq(schema.players.id, participant.playerId))
            .limit(1);
          player = playerData || null;
        }

        return {
          ...participant,
          team,
          player,
        };
      })
    );

    return enrichedParticipants;
  }

  static async deleteParticipants(matchId: string): Promise<void> {
    await db
      .delete(schema.matchParticipants)
      .where(eq(schema.matchParticipants.matchId, matchId));
  }

  static async updateParticipantScore(
    participantId: string,
    score: number,
    pointsEarned: number
  ): Promise<MatchParticipant> {
    const [participant] = await db
      .update(schema.matchParticipants)
      .set({ score, pointsEarned, updatedAt: new Date() })
      .where(eq(schema.matchParticipants.id, participantId))
      .returning();
    
    if (!participant) {
      throw new Error('Failed to update participant score');
    }
    return participant;
  }

  static async getParticipantById(participantId: string): Promise<MatchParticipant | undefined> {
    const [participant] = await db
      .select()
      .from(schema.matchParticipants)
      .where(eq(schema.matchParticipants.id, participantId))
      .limit(1);
    
    return participant;
  }

  static async getByIdWithDetails(id: string): Promise<any | undefined> {
    const match = await this.getById(id);
    if (!match) return undefined;

    // Fetch game details
    const [gameData] = await db
      .select()
      .from(schema.games)
      .where(eq(schema.games.id, match.gameId))
      .limit(1);

    // Fetch participants with details
    const participants = await this.getParticipantsWithDetails(id);

    return {
      ...match,
      game: gameData || null,
      participants,
    };
  }

  static async finishMatchWithPoints(
    id: string,
    winnerId: string | null,
    participantUpdates?: Array<{ participantId: string; score: number; result?: string }>
  ): Promise<any> {
    const { PointsService } = await import('./points.service');

    // Update match status to FINISHED with winner
    await this.update(id, { 
      status: 'FINISHED',
      winnerId: winnerId || undefined,
    });

    // Update participant scores if provided
    if (participantUpdates && participantUpdates.length > 0) {
      for (const update of participantUpdates) {
        const [participant] = await db
          .select()
          .from(schema.matchParticipants)
          .where(eq(schema.matchParticipants.id, update.participantId))
          .limit(1);

        if (participant) {
          // Set result based on whether they won
          const participantWinnerId = participant.teamId || participant.playerId;
          const result = winnerId === participantWinnerId ? 'WIN' : 'LOSS';

          await this.updateParticipantScore(
            update.participantId,
            update.score,
            0 // Points will be calculated by PointsService
          );

          // Update result
          await db
            .update(schema.matchParticipants)
            .set({ result: result as any, updatedAt: new Date() })
            .where(eq(schema.matchParticipants.id, update.participantId));
        }
      }
    }

    // Calculate and apply points
    const calculation = await PointsService.calculateMatchPoints(id);
    if (calculation) {
      await PointsService.applyPoints(calculation);
    }

    // Return updated match with all details
    return this.getByIdWithDetails(id);
  }
}

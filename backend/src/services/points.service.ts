import { db, schema } from '../config/database';
import { eq, and, desc } from 'drizzle-orm';
import type { Faculty } from '../db/schema';

export interface PointsCalculationResult {
  matchId: string;
  gameId: string;
  gameWeight: number;
  winnerFacultyId: string;
  winnerFacultyName: string;
  pointsAwarded: number;
  participantResults: Array<{
    participantId: string;
    teamId: string | null;
    playerId: string | null;
    facultyId: string;
    score: number;
    result: 'WIN' | 'LOSS' | 'DRAW' | null;
    pointsEarned: number;
  }>;
}

export class PointsService {
  /**
   * Calculate points for a finished match
   * - Winner gets: 3 * gameWeight points
   * - Teams/Players that participated get: (earnedPoints || 0) * gameWeight
   * - Loser gets: 0 points
   * - Draw gets: 1 * gameWeight points for each participant
   */
  static async calculateMatchPoints(matchId: string): Promise<PointsCalculationResult | null> {
    // Get match with all details
    const [match] = await db
      .select()
      .from(schema.matches)
      .where(eq(schema.matches.id, matchId))
      .limit(1);

    if (!match || match.status !== 'FINISHED') {
      console.warn(`Cannot calculate points: Match ${matchId} is not finished`);
      return null;
    }

    // Get game details (for pointWeight)
    const [game] = await db
      .select()
      .from(schema.games)
      .where(eq(schema.games.id, match.gameId))
      .limit(1);

    if (!game) {
      throw new Error(`Game not found: ${match.gameId}`);
    }

    // Get all participants with their details
    const participants = await db
      .select()
      .from(schema.matchParticipants)
      .where(eq(schema.matchParticipants.matchId, matchId));

    if (participants.length === 0) {
      throw new Error(`No participants found for match: ${matchId}`);
    }

    const participantResults = await Promise.all(
      participants.map(async (participant) => {
        let facultyId: string | null = null;

        // Get faculty ID based on team or player
        if (participant.teamId) {
          const [team] = await db
            .select()
            .from(schema.teams)
            .where(eq(schema.teams.id, participant.teamId))
            .limit(1);
          facultyId = team?.facultyId || null;
        } else if (participant.playerId) {
          const [player] = await db
            .select()
            .from(schema.players)
            .where(eq(schema.players.id, participant.playerId))
            .limit(1);
          facultyId = player?.facultyId || null;
        }

        if (!facultyId) {
          throw new Error(`Cannot determine faculty for participant: ${participant.id}`);
        }

        // Calculate points based on result
        let pointsEarned = 0;
        let result: 'WIN' | 'LOSS' | 'DRAW' | null = participant.result || null;

        // Check if this participant is the winner
        const isWinner =
          match.winnerId === participant.teamId || match.winnerId === participant.playerId;

        if (isWinner) {
          pointsEarned = 3 * game.pointWeight; // Winner gets 3 * weight
          result = 'WIN';
        } else if (participant.result === 'DRAW') {
          pointsEarned = 1 * game.pointWeight; // Draw gets 1 * weight
          result = 'DRAW';
        } else {
          pointsEarned = 0; // Loser gets 0
          result = 'LOSS';
        }

        // Add any bonus points from the match (e.g., if stored in pointsEarned before)
        // pointsEarned += participant.pointsEarned || 0;

        return {
          participantId: participant.id,
          teamId: participant.teamId,
          playerId: participant.playerId,
          facultyId,
          score: participant.score,
          result,
          pointsEarned,
        };
      })
    );

    // Get winner faculty details
    const winnerParticipant = participantResults.find(
      (p) =>
        match.winnerId === p.teamId || match.winnerId === p.playerId
    );

    if (!winnerParticipant) {
      throw new Error(`Winner not found in participants for match: ${matchId}`);
    }

    const [winnerFaculty] = await db
      .select()
      .from(schema.faculties)
      .where(eq(schema.faculties.id, winnerParticipant.facultyId))
      .limit(1);

    if (!winnerFaculty) {
      throw new Error(`Winner faculty not found: ${winnerParticipant.facultyId}`);
    }

    return {
      matchId,
      gameId: match.gameId,
      gameWeight: game.pointWeight,
      winnerFacultyId: winnerFaculty.id,
      winnerFacultyName: winnerFaculty.name,
      pointsAwarded: winnerParticipant.pointsEarned,
      participantResults,
    };
  }

  /**
   * Apply calculated points to faculties and update participants
   */
  static async applyPoints(calculation: PointsCalculationResult): Promise<void> {
    // Update each participant with their result and points
    for (const participant of calculation.participantResults) {
      await db
        .update(schema.matchParticipants)
        .set({
          result: participant.result as any,
          pointsEarned: participant.pointsEarned,
          updatedAt: new Date(),
        })
        .where(eq(schema.matchParticipants.id, participant.participantId));

      // Update faculty total points
      const [faculty] = await db
        .select()
        .from(schema.faculties)
        .where(eq(schema.faculties.id, participant.facultyId))
        .limit(1);

      if (faculty) {
        const newTotal = faculty.totalPoints + participant.pointsEarned;
        await db
          .update(schema.faculties)
          .set({
            totalPoints: newTotal,
            updatedAt: new Date(),
          })
          .where(eq(schema.faculties.id, participant.facultyId));

        console.log(
          `✅ Updated ${faculty.name} points: +${participant.pointsEarned} (Total: ${newTotal})`
        );
      }
    }
  }

  /**
   * Get faculty leaderboard sorted by total points (descending)
   */
  static async getLeaderboard(): Promise<Faculty[]> {
    const faculties = await db
      .select()
      .from(schema.faculties)
      .orderBy(
        desc(schema.faculties.totalPoints),
        schema.faculties.name
      );

    return faculties;
  }

  /**
   * Get detailed leaderboard with win/loss/draw statistics
   */
  static async getDetailedLeaderboard(): Promise<
    Array<{
      faculty: Faculty;
      wins: number;
      losses: number;
      draws: number;
      totalMatches: number;
      pointsPerMatch: number;
    }>
  > {
    const faculties = await this.getLeaderboard();

    const detailed = await Promise.all(
      faculties.map(async (faculty) => {
        // Get all match participants for this faculty
        const participants = await db
          .select()
          .from(schema.matchParticipants)
          .innerJoin(
            schema.teams,
            eq(schema.matchParticipants.teamId, schema.teams.id)
          )
          .where(eq(schema.teams.facultyId, faculty.id));

        const participantsIndividual = await db
          .select()
          .from(schema.matchParticipants)
          .innerJoin(
            schema.players,
            eq(schema.matchParticipants.playerId, schema.players.id)
          )
          .where(eq(schema.players.facultyId, faculty.id));

        const allParticipants = [
          ...participants.map((p) => p.match_participants),
          ...participantsIndividual.map((p) => p.match_participants),
        ];

        const wins = allParticipants.filter((p) => p.result === 'WIN').length;
        const losses = allParticipants.filter((p) => p.result === 'LOSS').length;
        const draws = allParticipants.filter((p) => p.result === 'DRAW').length;
        const totalMatches = allParticipants.length;

        return {
          faculty,
          wins,
          losses,
          draws,
          totalMatches,
          pointsPerMatch:
            totalMatches > 0
              ? parseFloat((faculty.totalPoints / totalMatches).toFixed(2))
              : 0,
        };
      })
    );

    return detailed;
  }

  /**
   * Get points history for a specific faculty
   */
  static async getFacultyPointsHistory(
    facultyId: string
  ): Promise<
    Array<{
      matchId: string;
      gameName: string;
      gameWeight: number;
      participantName: string;
      result: string;
      pointsEarned: number;
      createdAt: Date;
    }>
  > {
    // Get matches where faculty's teams/players participated
    const teamParticipants = await db
      .select()
      .from(schema.matchParticipants)
      .innerJoin(
        schema.teams,
        eq(schema.matchParticipants.teamId, schema.teams.id)
      )
      .innerJoin(
        schema.matches,
        eq(schema.matchParticipants.matchId, schema.matches.id)
      )
      .innerJoin(
        schema.games,
        eq(schema.matches.gameId, schema.games.id)
      )
      .where(
        and(
          eq(schema.teams.facultyId, facultyId),
          eq(schema.matches.status, 'FINISHED')
        )
      );

    const playerParticipants = await db
      .select()
      .from(schema.matchParticipants)
      .innerJoin(
        schema.players,
        eq(schema.matchParticipants.playerId, schema.players.id)
      )
      .innerJoin(
        schema.matches,
        eq(schema.matchParticipants.matchId, schema.matches.id)
      )
      .innerJoin(
        schema.games,
        eq(schema.matches.gameId, schema.games.id)
      )
      .where(
        and(
          eq(schema.players.facultyId, facultyId),
          eq(schema.matches.status, 'FINISHED')
        )
      );

    const history = [
      ...teamParticipants.map((item) => ({
        matchId: item.matches.id,
        gameName: item.games.name,
        gameWeight: item.games.pointWeight,
        participantName: item.teams.name,
        result: item.match_participants.result || 'UNKNOWN',
        pointsEarned: item.match_participants.pointsEarned,
        createdAt: item.matches.updatedAt,
      })),
      ...playerParticipants.map((item) => ({
        matchId: item.matches.id,
        gameName: item.games.name,
        gameWeight: item.games.pointWeight,
        participantName: item.players.name,
        result: item.match_participants.result || 'UNKNOWN',
        pointsEarned: item.match_participants.pointsEarned,
        createdAt: item.matches.updatedAt,
      })),
    ];

    // Sort by createdAt descending
    return history.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

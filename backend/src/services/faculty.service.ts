import { db, schema } from '../config/database';
import { eq } from 'drizzle-orm';
import type { Faculty, NewFaculty } from '../db/schema';

export class FacultyService {
  static async getAll(): Promise<Faculty[]> {
    return await db.select().from(schema.faculties);
  }

  static async getById(id: string): Promise<Faculty | undefined> {
    const [faculty] = await db
      .select()
      .from(schema.faculties)
      .where(eq(schema.faculties.id, id))
      .limit(1);
    
    return faculty;
  }

  static async create(data: NewFaculty): Promise<Faculty> {
    const [faculty] = await db
      .insert(schema.faculties)
      .values(data)
      .returning();
    
    return faculty;
  }

  static async update(id: string, data: Partial<NewFaculty>): Promise<Faculty> {
    const [faculty] = await db
      .update(schema.faculties)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.faculties.id, id))
      .returning();
    
    return faculty;
  }

  static async delete(id: string): Promise<void> {
    await db
      .delete(schema.faculties)
      .where(eq(schema.faculties.id, id));
  }
}

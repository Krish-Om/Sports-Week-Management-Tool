import { db, schema } from '../config/database';
import { eq } from 'drizzle-orm';
import type { User, NewUser } from '../db/schema';

export class UserService {
  static async findByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username))
      .limit(1);
    
    return user;
  }

  static async findById(id: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    
    return user;
  }

  static async create(data: NewUser): Promise<User> {
    const [user] = await db
      .insert(schema.users)
      .values(data)
      .returning();
    
    return user;
  }

  static async getAll(): Promise<User[]> {
    return await db.select().from(schema.users);
  }

  static async delete(id: string): Promise<void> {
    await db
      .delete(schema.users)
      .where(eq(schema.users.id, id));
  }
}

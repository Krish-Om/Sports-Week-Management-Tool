import { db, schema } from '../config/database';
import { eq } from 'drizzle-orm';
import type { User, NewUser } from '../db/schema';
import bcrypt from 'bcryptjs';

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
    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const [user] = await db
      .insert(schema.users)
      .values(data)
      .returning();
    
    return user;
  }

  static async update(id: string, data: Partial<NewUser>): Promise<User> {
    // Hash password if being updated
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const [user] = await db
      .update(schema.users)
      .set(data)
      .where(eq(schema.users.id, id))
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

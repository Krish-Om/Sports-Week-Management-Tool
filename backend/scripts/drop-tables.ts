import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!);

async function dropAllTables() {
  console.log('🗑️  Dropping all existing tables...');
  
  try {
    await sql.unsafe(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO sports;
      GRANT ALL ON SCHEMA public TO public;
    `);
    
    console.log('✅ All tables dropped successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

dropAllTables();

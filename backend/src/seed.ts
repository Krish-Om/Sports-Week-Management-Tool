import { db, schema } from './config/database';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting seed...');

  try {
    // Create Faculties
    console.log('Creating faculties...');
    const facultyData = await db.insert(schema.faculties).values([
      { name: 'CSIT' },
      { name: 'BCA' },
      { name: 'BSW' },
      { name: 'BBS' },
    ]).returning();
    
    console.log(`✅ Created ${facultyData.length} faculties`);

    // Create Admin User
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const [admin] = await db.insert(schema.users).values({
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    }).returning();
    
    console.log(`✅ Admin created: ${admin.username}`);

    // Create sample manager users
    console.log('Creating sample managers...');
    const managers = await db.insert(schema.users).values([
      {
        username: 'futsal_manager',
        password: await bcrypt.hash('futsal2026', 10),
        role: 'MANAGER',
      },
      {
        username: 'chess_manager',
        password: await bcrypt.hash('chess2026', 10),
        role: 'MANAGER',
      },
    ]).returning();
    
    console.log(`✅ Created ${managers.length} sample managers`);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   Admin: username=admin, password=admin123');
    console.log('   Manager: username=futsal_manager, password=futsal2026');
    console.log('   Manager: username=chess_manager, password=chess2026');
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

seed();

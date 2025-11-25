const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verifying Eerie API Database...\n');

  const userCount = await prisma.user.count();
  const entityCount = await prisma.entity.count();
  const locationCount = await prisma.location.count();
  const incidentCount = await prisma.incident.count();

  console.log('📊 Database Statistics:');
  console.log(`   Users: ${userCount}`);
  console.log(`   Entities: ${entityCount}`);
  console.log(`   Locations: ${locationCount}`);
  console.log(`   Incidents: ${incidentCount}\n`);

  console.log('👻 Sample Entities:');
  const entities = await prisma.entity.findMany({
    take: 5,
    select: {
      name: true,
      classification: true,
      threatLevel: true,
    },
  });
  
  entities.forEach(entity => {
    console.log(`   - ${entity.name} (${entity.classification}) - Threat Level: ${entity.threatLevel}`);
  });

  console.log('\n👥 Users:');
  const users = await prisma.user.findMany({
    select: {
      username: true,
      email: true,
      role: true,
    },
  });
  
  users.forEach(user => {
    console.log(`   - ${user.username} (${user.role}) - ${user.email}`);
  });

  console.log('\n✅ Database verification complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. Run "npx prisma studio" to view data in browser');
  console.log('   2. Start building your API endpoints');
  console.log('   3. Check SETUP_WINDOWS.md for more info');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

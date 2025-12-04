const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verifying Eerie API Community Features...\n');

  // Users with roles
  const users = await prisma.user.findMany({
    select: {
      username: true,
      role: true,
      reputationScore: true,
      email: true,
    },
  });

  console.log('👥 Users & Reputation:');
  users.forEach(user => {
    console.log(`   - ${user.username} (${user.role}) - ${user.reputationScore} points`);
    console.log(`     Email: ${user.email}`);
  });
  console.log();

  // Entity Suggestions
  const suggestions = await prisma.entitySuggestion.findMany({
    include: {
      submittedBy: {
        select: { username: true },
      },
    },
  });

  console.log('💡 Entity Suggestions:');
  suggestions.forEach(s => {
    console.log(`   - ${s.name} (${s.classification})`);
    console.log(`     Status: ${s.status}`);
    console.log(`     Submitted by: ${s.submittedBy.username}`);
    console.log(`     Threat Level: ${s.threatLevel}/10`);
  });
  console.log();

  // Incident Votes
  const votes = await prisma.incidentVote.findMany({
    include: {
      user: {
        select: { username: true },
      },
      incident: {
        select: { title: true },
      },
    },
  });

  console.log('🗳️  Incident Votes:');
  votes.forEach(v => {
    console.log(`   - ${v.user.username} voted "${v.voteType}" on:`);
    console.log(`     "${v.incident.title}"`);
  });
  console.log();

  // Incidents with credibility scores
  const incidents = await prisma.incident.findMany({
    select: {
      title: true,
      credibilityScore: true,
      status: true,
    },
  });

  console.log('📊 Incident Credibility Scores:');
  incidents.forEach(i => {
    const scoreColor = i.credibilityScore >= 5 ? '✅' : i.credibilityScore >= 0 ? '⚠️' : '❌';
    console.log(`   ${scoreColor} ${i.title}`);
    console.log(`     Score: ${i.credibilityScore > 0 ? '+' : ''}${i.credibilityScore} | Status: ${i.status}`);
  });
  console.log();

  // Contribution Logs
  const logs = await prisma.contributionLog.findMany({
    include: {
      user: {
        select: { username: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  console.log('📜 Contribution History:');
  logs.forEach(log => {
    console.log(`   - ${log.user.username}: ${log.actionType}`);
    console.log(`     ${log.description} (+${log.pointsEarned} points)`);
  });
  console.log();

  // Summary
  console.log('📈 Community Statistics:');
  console.log(`   Total Users: ${users.length}`);
  console.log(`   Total Suggestions: ${suggestions.length}`);
  console.log(`   Pending Suggestions: ${suggestions.filter(s => s.status === 'PENDING').length}`);
  console.log(`   Approved Suggestions: ${suggestions.filter(s => s.status === 'APPROVED').length}`);
  console.log(`   Total Votes Cast: ${votes.length}`);
  console.log(`   Total Contributions Logged: ${logs.length}`);
  console.log();

  console.log('✅ Community features verification complete!');
  console.log('\n🎮 Try these features:');
  console.log('   1. Login as contributor@eerie-api.com / contributor123');
  console.log('   2. Visit /suggest to submit an entity');
  console.log('   3. Login as moderator@eerie-api.com / moderator123');
  console.log('   4. Visit /moderation to review suggestions');
  console.log('   5. Vote on incidents to see credibility scores');
  console.log('   6. Check user profiles at /profile/:id');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

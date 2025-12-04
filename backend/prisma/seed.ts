import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌙 Starting Eerie API database seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@eerie-api.com' },
    update: {},
    create: {
      email: 'admin@eerie-api.com',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      reputationScore: 1000,
      bio: 'System administrator and lead investigator',
    },
  });

  console.log('✅ Admin user created');

  // Create moderator user
  const moderatorPassword = await bcrypt.hash('moderator123', 10);
  const moderatorUser = await prisma.user.upsert({
    where: { email: 'moderator@eerie-api.com' },
    update: {},
    create: {
      email: 'moderator@eerie-api.com',
      username: 'moderator',
      password: moderatorPassword,
      role: 'MODERATOR',
      reputationScore: 500,
      bio: 'Community moderator and entity reviewer',
    },
  });

  console.log('✅ Moderator user created');

  // Create contributor user
  const contributorPassword = await bcrypt.hash('contributor123', 10);
  const contributorUser = await prisma.user.upsert({
    where: { email: 'contributor@eerie-api.com' },
    update: {},
    create: {
      email: 'contributor@eerie-api.com',
      username: 'contributor',
      password: contributorPassword,
      role: 'CONTRIBUTOR',
      reputationScore: 250,
      bio: 'Active community contributor',
    },
  });

  console.log('✅ Contributor user created');

  // Create locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Waverly Hills Sanatorium',
        address: '4400 Paralee Drive',
        city: 'Louisville',
        state: 'Kentucky',
        country: 'USA',
        latitude: 38.1467,
        longitude: -85.6547,
        description: 'Historic tuberculosis hospital with reported paranormal activity',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Aokigahara Forest',
        city: 'Fujikawaguchiko',
        country: 'Japan',
        latitude: 35.4667,
        longitude: 138.6333,
        description: 'Dense forest at the base of Mount Fuji, known for supernatural phenomena',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Point Pleasant',
        city: 'Point Pleasant',
        state: 'West Virginia',
        country: 'USA',
        latitude: 38.8445,
        longitude: -82.1371,
        description: 'Small town famous for Mothman sightings in the 1960s',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Loch Ness',
        city: 'Inverness',
        country: 'Scotland',
        latitude: 57.3229,
        longitude: -4.4244,
        description: 'Large freshwater loch, home to the legendary Loch Ness Monster',
      },
    }),
    prisma.location.create({
      data: {
        name: 'The Stanley Hotel',
        address: '333 E Wonderview Ave',
        city: 'Estes Park',
        state: 'Colorado',
        country: 'USA',
        latitude: 40.3838,
        longitude: -105.5166,
        description: 'Historic hotel that inspired Stephen King\'s "The Shining"',
      },
    }),
  ]);

  console.log('✅ Locations created');

  // Create entities
  const entities = await Promise.all([
    prisma.entity.create({
      data: {
        name: 'The Lady in White',
        classification: 'Apparition',
        threatLevel: 2,
        description: 'A spectral figure of a woman in a white Victorian dress, often seen in the fifth floor hallway. Witnesses report feeling overwhelming sadness in her presence.',
        abilities: JSON.stringify(['Manifestation', 'Emotional manipulation', 'Temperature drop']),
        weaknesses: JSON.stringify(['Sunlight', 'Salt barriers', 'Religious symbols']),
        firstSighted: new Date('1926-03-15'),
        lastSighted: new Date('2024-10-31'),
        status: 'ACTIVE',
      },
    }),
    prisma.entity.create({
      data: {
        name: 'Mothman',
        classification: 'Cryptid',
        threatLevel: 7,
        description: 'Large humanoid creature with massive wings and glowing red eyes. Sightings often precede disasters. Stands approximately 7 feet tall.',
        abilities: JSON.stringify(['Flight', 'Precognition', 'Hypnotic gaze', 'Superhuman speed']),
        weaknesses: JSON.stringify(['Bright lights', 'Loud noises']),
        firstSighted: new Date('1966-11-15'),
        lastSighted: new Date('2023-08-12'),
        status: 'ACTIVE',
      },
    }),
    prisma.entity.create({
      data: {
        name: 'Nessie',
        classification: 'Cryptid',
        threatLevel: 3,
        description: 'Large aquatic creature resembling a plesiosaur. Long neck, small head, and four flippers. Estimated length of 20-30 feet.',
        abilities: JSON.stringify(['Aquatic adaptation', 'Camouflage', 'Sonar disruption']),
        weaknesses: JSON.stringify(['Unknown']),
        firstSighted: new Date('1933-05-02'),
        lastSighted: new Date('2024-06-20'),
        status: 'ACTIVE',
      },
    }),
    prisma.entity.create({
      data: {
        name: 'Shadow Person - Room 217',
        classification: 'Apparition',
        threatLevel: 4,
        description: 'Dark humanoid silhouette that appears in mirrors and peripheral vision. No facial features visible. Causes electronic disturbances.',
        abilities: JSON.stringify(['Shadow manipulation', 'Electronic interference', 'Teleportation']),
        weaknesses: JSON.stringify(['Direct light', 'Mirrors facing mirrors']),
        firstSighted: new Date('1911-06-25'),
        lastSighted: new Date('2024-11-15'),
        status: 'ACTIVE',
      },
    }),
    prisma.entity.create({
      data: {
        name: 'The Rake',
        classification: 'Cryptid',
        threatLevel: 9,
        description: 'Pale, hairless humanoid creature with elongated limbs and claws. Extremely aggressive and fast. Hunts at night.',
        abilities: JSON.stringify(['Night vision', 'Enhanced strength', 'Climbing', 'Stealth']),
        weaknesses: JSON.stringify(['Fire', 'Silver weapons']),
        firstSighted: new Date('2003-07-19'),
        lastSighted: new Date('2024-09-30'),
        status: 'ACTIVE',
      },
    }),
    prisma.entity.create({
      data: {
        name: 'Yurei of Aokigahara',
        classification: 'Undead',
        threatLevel: 6,
        description: 'Vengeful spirit of a woman in white kimono with long black hair covering her face. Lures travelers deeper into the forest.',
        abilities: JSON.stringify(['Illusion casting', 'Mind control', 'Intangibility']),
        weaknesses: JSON.stringify(['Buddhist prayers', 'Ofuda talismans', 'Purification rituals']),
        firstSighted: new Date('1950-01-01'),
        lastSighted: new Date('2024-10-05'),
        status: 'ACTIVE',
      },
    }),
    prisma.entity.create({
      data: {
        name: 'The Grinning Man',
        classification: 'Extraterrestrial',
        threatLevel: 5,
        description: 'Tall figure in metallic suit with an unnaturally wide smile. Associated with UFO sightings and Men in Black encounters.',
        abilities: JSON.stringify(['Telepathy', 'Memory manipulation', 'Technological interference']),
        weaknesses: JSON.stringify(['Unknown']),
        firstSighted: new Date('1966-10-11'),
        lastSighted: new Date('2024-07-04'),
        status: 'ACTIVE',
      },
    }),
    prisma.entity.create({
      data: {
        name: 'Bloody Mary',
        classification: 'Demonic',
        threatLevel: 8,
        description: 'Malevolent entity that appears in mirrors when summoned. Disfigured face with bleeding eyes. Extremely hostile.',
        abilities: JSON.stringify(['Mirror manifestation', 'Curse infliction', 'Physical harm', 'Soul binding']),
        weaknesses: JSON.stringify(['Breaking mirrors', 'Exorcism', 'Holy water']),
        firstSighted: new Date('1978-10-31'),
        lastSighted: new Date('2024-10-31'),
        status: 'ACTIVE',
      },
    }),
    prisma.entity.create({
      data: {
        name: 'The Smiling Man',
        classification: 'Other',
        threatLevel: 7,
        description: 'Impossibly tall man in vintage suit who walks with unnatural movements. Fixed smile never changes. Follows victims for days.',
        abilities: JSON.stringify(['Reality distortion', 'Stalking', 'Psychological torture', 'Dimensional shifting']),
        weaknesses: JSON.stringify(['Crowds', 'Photographs']),
        firstSighted: new Date('2012-03-22'),
        lastSighted: new Date('2024-11-01'),
        status: 'ACTIVE',
      },
    }),
    prisma.entity.create({
      data: {
        name: 'Chupacabra',
        classification: 'Cryptid',
        threatLevel: 6,
        description: 'Reptilian creature that drains blood from livestock. Spines along back, large eyes, and sharp fangs. Moves on two or four legs.',
        abilities: JSON.stringify(['Blood draining', 'Enhanced agility', 'Paralytic bite']),
        weaknesses: JSON.stringify(['Garlic', 'Wolfsbane', 'Silver']),
        firstSighted: new Date('1995-03-01'),
        lastSighted: new Date('2024-08-15'),
        status: 'ACTIVE',
      },
    }),
    prisma.entity.create({
      data: {
        name: 'The Hatman',
        classification: 'Apparition',
        threatLevel: 5,
        description: 'Shadow figure wearing a wide-brimmed hat and long coat. Appears during sleep paralysis. Radiates malevolence.',
        abilities: JSON.stringify(['Sleep paralysis induction', 'Fear manifestation', 'Dream invasion']),
        weaknesses: JSON.stringify(['Lucid dreaming', 'Protection sigils']),
        firstSighted: new Date('2001-01-01'),
        lastSighted: new Date('2024-11-20'),
        status: 'ACTIVE',
      },
    }),
    prisma.entity.create({
      data: {
        name: 'Wendigo',
        classification: 'Demonic',
        threatLevel: 10,
        description: 'Emaciated humanoid with antlers and decaying flesh. Created when humans resort to cannibalism. Insatiable hunger for human flesh.',
        abilities: JSON.stringify(['Superhuman strength', 'Regeneration', 'Possession', 'Weather manipulation']),
        weaknesses: JSON.stringify(['Fire', 'Silver', 'Anasazi symbols']),
        firstSighted: new Date('1661-01-01'),
        lastSighted: new Date('2024-02-14'),
        status: 'ACTIVE',
      },
    }),
    prisma.entity.create({
      data: {
        name: 'Grey Visitor',
        classification: 'Extraterrestrial',
        threatLevel: 4,
        description: 'Classic grey alien with large black eyes and grey skin. Approximately 4 feet tall. Associated with abduction phenomena.',
        abilities: JSON.stringify(['Telepathy', 'Levitation', 'Memory wiping', 'Paralysis beam']),
        weaknesses: JSON.stringify(['Electromagnetic pulses', 'Certain frequencies']),
        firstSighted: new Date('1947-07-08'),
        lastSighted: new Date('2024-09-15'),
        status: 'ACTIVE',
      },
    }),
    prisma.entity.create({
      data: {
        name: 'The Nurse',
        classification: 'Undead',
        threatLevel: 3,
        description: 'Ghost of a tuberculosis nurse still making her rounds. Carries vintage medical equipment. Generally benign but territorial.',
        abilities: JSON.stringify(['Manifestation', 'Object manipulation', 'Healing touch']),
        weaknesses: JSON.stringify(['Sage', 'Respectful communication']),
        firstSighted: new Date('1932-11-20'),
        lastSighted: new Date('2024-10-15'),
        status: 'ACTIVE',
      },
    }),
    prisma.entity.create({
      data: {
        name: 'Black Eyed Child',
        classification: 'Demonic',
        threatLevel: 8,
        description: 'Child with completely black eyes who requests entry to homes or vehicles. Causes overwhelming dread. Never ages.',
        abilities: JSON.stringify(['Compulsion', 'Fear aura', 'Invitation requirement', 'Agelessness']),
        weaknesses: JSON.stringify(['Refusal of entry', 'Salt', 'Iron']),
        firstSighted: new Date('1996-01-01'),
        lastSighted: new Date('2024-11-10'),
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log('✅ Entities created');

  // Create entity-location relationships
  await Promise.all([
    prisma.entityLocation.create({
      data: {
        entityId: entities[0].id, // Lady in White
        locationId: locations[0].id, // Waverly Hills
        frequency: 'Weekly',
        lastSeen: new Date('2024-10-31'),
      },
    }),
    prisma.entityLocation.create({
      data: {
        entityId: entities[1].id, // Mothman
        locationId: locations[2].id, // Point Pleasant
        frequency: 'Rare',
        lastSeen: new Date('2023-08-12'),
      },
    }),
    prisma.entityLocation.create({
      data: {
        entityId: entities[2].id, // Nessie
        locationId: locations[3].id, // Loch Ness
        frequency: 'Monthly',
        lastSeen: new Date('2024-06-20'),
      },
    }),
    prisma.entityLocation.create({
      data: {
        entityId: entities[3].id, // Shadow Person
        locationId: locations[4].id, // Stanley Hotel
        frequency: 'Daily',
        lastSeen: new Date('2024-11-15'),
      },
    }),
    prisma.entityLocation.create({
      data: {
        entityId: entities[5].id, // Yurei
        locationId: locations[1].id, // Aokigahara
        frequency: 'Weekly',
        lastSeen: new Date('2024-10-05'),
      },
    }),
  ]);

  console.log('✅ Entity-location relationships created');

  // Create sample incidents
  const incidents = await Promise.all([
    prisma.incident.create({
      data: {
        title: 'Lady in White Sighting - Fifth Floor',
        description: 'Multiple visitors reported seeing a woman in white dress walking through walls on the fifth floor. Temperature dropped 15 degrees. EVP recordings captured whispers.',
        date: new Date('2024-10-31T23:30:00'),
        severity: 3,
        witnesses: 4,
        verified: true,
        evidence: JSON.stringify(['evp_recording_001.mp3', 'thermal_image_001.jpg']),
        status: 'CONFIRMED',
        entityId: entities[0].id,
        locationId: locations[0].id,
        reportedById: moderatorUser.id,
        credibilityScore: 3,
      },
    }),
    prisma.incident.create({
      data: {
        title: 'Mothman Spotted Near Bridge',
        description: 'Witness reported seeing large winged creature with red eyes perched on bridge structure. Creature flew away at high speed when approached.',
        date: new Date('2023-08-12T21:15:00'),
        severity: 7,
        witnesses: 1,
        verified: true,
        evidence: JSON.stringify(['witness_sketch_001.jpg', 'feather_sample.jpg']),
        status: 'CONFIRMED',
        entityId: entities[1].id,
        locationId: locations[2].id,
        reportedById: moderatorUser.id,
        credibilityScore: 5,
      },
    }),
    prisma.incident.create({
      data: {
        title: 'Nessie Surface Breach',
        description: 'Tourist captured video of large creature breaking water surface. Analysis shows object approximately 25 feet long with long neck.',
        date: new Date('2024-06-20T14:22:00'),
        severity: 4,
        witnesses: 12,
        verified: false,
        evidence: JSON.stringify(['video_001.mp4', 'sonar_reading.png']),
        status: 'INVESTIGATING',
        entityId: entities[2].id,
        locationId: locations[3].id,
        reportedById: contributorUser.id,
        credibilityScore: -2,
      },
    }),
  ]);

  console.log('✅ Incidents created');

  // Create sample votes
  await Promise.all([
    prisma.incidentVote.create({
      data: {
        incidentId: incidents[0].id,
        userId: contributorUser.id,
        voteType: 'CREDIBLE',
      },
    }),
    prisma.incidentVote.create({
      data: {
        incidentId: incidents[0].id,
        userId: adminUser.id,
        voteType: 'CREDIBLE',
      },
    }),
    prisma.incidentVote.create({
      data: {
        incidentId: incidents[2].id,
        userId: moderatorUser.id,
        voteType: 'NOT_CREDIBLE',
      },
    }),
  ]);

  console.log('✅ Incident votes created');

  // Create sample entity suggestions
  await Promise.all([
    prisma.entitySuggestion.create({
      data: {
        name: 'The Flatwoods Monster',
        classification: 'Extraterrestrial',
        threatLevel: 6,
        description: 'A large humanoid creature with a spade-shaped head, reported in Flatwoods, West Virginia in 1952.',
        abilities: JSON.stringify(['Levitation', 'Toxic gas emission', 'Glowing eyes']),
        weaknesses: JSON.stringify(['Unknown']),
        firstSighted: new Date('1952-09-12'),
        sourceCitation: 'Feschino, F. (2004). The Braxton County Monster. Quarrier Press.',
        status: 'PENDING',
        submittedById: contributorUser.id,
      },
    }),
    prisma.entitySuggestion.create({
      data: {
        name: 'Spring-Heeled Jack',
        classification: 'Other',
        threatLevel: 5,
        description: 'Victorian-era entity known for incredible jumping ability and terrorizing London.',
        abilities: JSON.stringify(['Superhuman jumping', 'Fire breathing', 'Sharp claws']),
        weaknesses: JSON.stringify(['Unknown']),
        firstSighted: new Date('1837-01-01'),
        lastSighted: new Date('1904-01-01'),
        sourceCitation: 'Dash, M. (2000). Spring-Heeled Jack: To Victorian Bugaboo from Suburban Ghost.',
        status: 'APPROVED',
        reviewComment: 'Excellent historical research!',
        reviewedAt: new Date('2024-11-20'),
        submittedById: contributorUser.id,
      },
    }),
  ]);

  console.log('✅ Entity suggestions created');

  // Create contribution logs
  await Promise.all([
    prisma.contributionLog.create({
      data: {
        userId: contributorUser.id,
        actionType: 'ENTITY_SUGGESTED',
        pointsEarned: 10,
        description: 'Suggested entity: The Flatwoods Monster',
      },
    }),
    prisma.contributionLog.create({
      data: {
        userId: contributorUser.id,
        actionType: 'ENTITY_APPROVED',
        pointsEarned: 50,
        description: 'Entity approved: Spring-Heeled Jack',
      },
    }),
    prisma.contributionLog.create({
      data: {
        userId: contributorUser.id,
        actionType: 'VOTE_CAST',
        pointsEarned: 1,
        description: 'Voted on incident: Lady in White Sighting - Fifth Floor',
      },
    }),
  ]);

  console.log('✅ Contribution logs created');
  console.log('🎃 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

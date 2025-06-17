import { query } from './db.js'; // Adjust the path if needed

async function seedSampleProvidersAndSlots() {
  const providers = [
    {
      firstName: 'Tony',
      lastName: 'Styles',
      email: 'tony@barbershop.com',
      password: 'hashed-password-1', // In production, hash with bcrypt
      specialty: 'Barber',
      bio: 'Experienced barber, specializing in fades and trims.',
      rating: 4.8
    },
    {
      firstName: 'Linda',
      lastName: 'Wellness',
      email: 'linda@massagehub.com',
      password: 'hashed-password-2',
      specialty: 'Massage Therapist',
      bio: 'Certified massage therapist focusing on deep tissue and relaxation techniques.',
      rating: 4.9
    }
  ];

  for (const provider of providers) {
    // Insert provider and let Postgres generate the UUID
    const result = await query(`
      INSERT INTO providers (first_name, last_name, email, password, specialty, bio, rating)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [
      provider.firstName,
      provider.lastName,
      provider.email,
      provider.password,
      provider.specialty,
      provider.bio,
      provider.rating
    ]);

    const providerId = result.rows[0].id;

    // Generate time slots for today and tomorrow
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const formattedToday = today.toISOString().split('T')[0];
    const formattedTomorrow = tomorrow.toISOString().split('T')[0];

    const timeSlots = [
      { day: formattedToday, start: '09:00:00', end: '09:30:00' },
      { day: formattedToday, start: '10:00:00', end: '10:30:00' },
      { day: formattedTomorrow, start: '14:00:00', end: '14:30:00' }
    ];

    for (const slot of timeSlots) {
      await query(`
        INSERT INTO time_slots (provider_id, day, start_time, end_time)
        VALUES ($1, $2, $3, $4)
      `, [providerId, slot.day, slot.start, slot.end]);
    }
  }

  console.log('✅ Sample providers and time slots inserted');
}

export {seedSampleProvidersAndSlots}
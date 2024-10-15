
import { Users } from './models/user.schema';
import { UserPreferences } from './models/preferences.schema';
import { Stores } from './models/store.schema';
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';

async function seedDatabase() {
  const amountOfpreferences = 5;
  const amountOfUsers = 10;
  const amountOfStores = 5;
  const amountOfTables = 5;
  
  try {
    await Users.deleteMany({});
    await UserPreferences.deleteMany({});
    await Stores.deleteMany({});

    // Create user preferences
    const preferences = Array.from({ length: amountOfpreferences }, async () => {
      const preference = new UserPreferences({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
      });
      return await preference.save();
    });
    //Await saving to use ref id
    const savedPreferences = await Promise.all(preferences); 
    const preferencesIDs = savedPreferences.map(pref => pref._id)
    // Create users
    Array.from({ length: amountOfUsers }, async () => {
      const user = new Users({
        name: faker.person.fullName(),
        preferences: getRandomPreferences(preferencesIDs)
      });
      return await user.save();
    });

    // Create stores
    Array.from({ length: amountOfStores }, async () => {
      const tables = Array.from({ length: amountOfTables }, () => ({
        _id: new Types.ObjectId(),
        name: `Table-${Math.floor(Math.random() * 1000)}`,
        capacity: faker.number.int({ min: 2, max: 10 }),
      }));

      const store = new Stores({
        name: faker.company.name(),
        preferences: getRandomPreferences(preferencesIDs),
        tables,
        reservations: []
      });

      return await store.save();  // Save the store
    });
    

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
}

function getRandomPreferences(preferences: Types.ObjectId[]): Types.ObjectId[] {
  const count = Math.floor(Math.random() * (preferences.length + 1));

  if (count === 0) {
    return [];
  }
  //shuffle and get values
  const shuffledPreferences = preferences.sort(() => Math.random() - 0.5);
  return shuffledPreferences.slice(0, count);
}

export default seedDatabase;
import {setupDatabase} from '../models';

export const initDb = async () => {
  await setupDatabase();
};

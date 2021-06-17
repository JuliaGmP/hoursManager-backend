const dotenv = require('dotenv');
const envFound = dotenv.config();

if (!envFound) {
  throw new Error("Couldn't find .env file");
}

export const mongoURL: string | undefined = process.env.MONGO_URL;

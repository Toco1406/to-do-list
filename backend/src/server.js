import 'dotenv/config';
import app from './app.js';
import { connectDb } from './config/db.js'
import { config } from './config/env.js'
await connectDb(config.mongoUri);
import { configDotenv } from "dotenv";

configDotenv();

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`API disponible sur http://localhost:${port}`);
});

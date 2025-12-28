import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv';
import { resolve } from 'path';

if (process.env.NODE_ENV === 'PROD') {
  dotenv.config({ path: resolve(__dirname, '.env.prod') });
} else {
  dotenv.config({ path: resolve(__dirname, '.env.local') });
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required for migrations');
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  breakpoints: true,
});

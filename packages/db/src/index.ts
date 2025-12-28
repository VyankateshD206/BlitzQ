import { neon, Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema/schema";


type DbEnv = {
  DATABASE_URL : string
}

export function createDbClient(env:DbEnv) {
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  return drizzle({ client: pool, schema });
}

export type DrizzleClient = ReturnType<typeof createDbClient>;
export * from './schema/schema';

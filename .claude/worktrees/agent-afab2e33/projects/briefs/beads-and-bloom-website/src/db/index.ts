import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import * as relations from "./relations";

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local to connect to Neon Postgres."
    );
  }
  const sql = neon(url);
  return drizzle({ client: sql, schema: { ...schema, ...relations } });
}

/** Lazy-initialized database client. Throws on first query if DATABASE_URL is missing. */
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_target, prop, receiver) {
    const instance = getDb();
    return Reflect.get(instance, prop, receiver);
  },
});

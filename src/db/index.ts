import { drizzle } from "drizzle-orm/postgres-js";
// import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const path = process.env.AUTH_DRIZZLE_URL as string;

// const migrationClient = postgres(path, {
//   max: 1,
// });
//
// migrate(drizzle(migrationClient), { migrationsFolder: "./migrations" });

export const queryClient = postgres(path as string);
export const db = drizzle(queryClient);

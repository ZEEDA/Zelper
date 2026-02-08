import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

const DB_PATH = process.env.DATABASE_PATH || './database.sqlite';

// Create SQLite connection
const sqlite = new Database(DB_PATH);

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });

// Export schema for use in queries
export * from './schema.js';

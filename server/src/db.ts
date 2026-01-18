import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const DB_PATH = process.env.DATABASE_PATH || './database.sqlite';

// Create database connection
const db = new sqlite3.Database(DB_PATH);

// Promisify database methods
export const dbRun = (sql: string, params: any = []): Promise<{ lastID: number; changes: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};
export const dbGet = promisify(db.get.bind(db)) as <T = any>(sql: string, params?: any) => Promise<T | undefined>;
export const dbAll = promisify(db.all.bind(db)) as <T = any>(sql: string, params?: any) => Promise<T[]>;

// Initialize database schema
export async function initializeDatabase() {
  try {
    // Users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        daily_budget REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Work sessions table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS work_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        check_in_time DATETIME NOT NULL,
        check_out_time DATETIME,
        status TEXT CHECK(status IN ('checked_in', 'on_break', 'checked_out')) DEFAULT 'checked_in',
        total_work_minutes INTEGER DEFAULT 0,
        total_break_minutes INTEGER DEFAULT 0,
        timeline_json TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Tasks table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        work_session_id INTEGER,
        title TEXT NOT NULL,
        estimated_minutes INTEGER,
        actual_minutes INTEGER DEFAULT 0,
        completed BOOLEAN DEFAULT 0,
        started_at DATETIME,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (work_session_id) REFERENCES work_sessions(id) ON DELETE SET NULL
      )
    `);

    // Books table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        type TEXT CHECK(type IN ('paper', 'pdf')) NOT NULL,
        total_pages INTEGER NOT NULL,
        current_page INTEGER DEFAULT 0,
        last_read_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Reading sessions table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS reading_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        start_page INTEGER NOT NULL,
        end_page INTEGER NOT NULL,
        duration_minutes INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      )
    `);

    // Expenses table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

export default db;

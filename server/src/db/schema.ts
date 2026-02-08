import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    name: text('name'),
    dailyBudget: real('daily_budget').default(0),
    resetToken: text('reset_token'),
    resetTokenExpiry: integer('reset_token_expiry', { mode: 'timestamp' }),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Work sessions table
export const workSessions = sqliteTable('work_sessions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    checkInTime: text('check_in_time').notNull(),
    checkOutTime: text('check_out_time'),
    status: text('status', { enum: ['checked_in', 'on_break', 'checked_out'] }).default('checked_in'),
    totalWorkMinutes: integer('total_work_minutes').default(0),
    totalBreakMinutes: integer('total_break_minutes').default(0),
    lastBreakStartTime: text('last_break_start_time'),
    timelineJson: text('timeline_json'),
});

// Tasks table
export const tasks = sqliteTable('tasks', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    workSessionId: integer('work_session_id').references(() => workSessions.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    estimatedMinutes: integer('estimated_minutes'),
    actualMinutes: integer('actual_minutes').default(0),
    completed: integer('completed', { mode: 'boolean' }).default(false),
    startedAt: text('started_at'),
    completedAt: text('completed_at'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Books table
export const books = sqliteTable('books', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    type: text('type', { enum: ['paper', 'pdf'] }).notNull(),
    totalPages: integer('total_pages').notNull(),
    currentPage: integer('current_page').default(0),
    lastReadAt: text('last_read_at'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Reading sessions table
export const readingSessions = sqliteTable('reading_sessions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    bookId: integer('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
    startPage: integer('start_page').notNull(),
    endPage: integer('end_page').notNull(),
    durationMinutes: integer('duration_minutes'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Expenses table
export const expenses = sqliteTable('expenses', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    amount: real('amount').notNull(),
    category: text('category').notNull(),
    note: text('note'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    workSessions: many(workSessions),
    tasks: many(tasks),
    books: many(books),
    readingSessions: many(readingSessions),
    expenses: many(expenses),
}));

export const workSessionsRelations = relations(workSessions, ({ one, many }) => ({
    user: one(users, {
        fields: [workSessions.userId],
        references: [users.id],
    }),
    tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
    user: one(users, {
        fields: [tasks.userId],
        references: [users.id],
    }),
    workSession: one(workSessions, {
        fields: [tasks.workSessionId],
        references: [workSessions.id],
    }),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
    user: one(users, {
        fields: [books.userId],
        references: [users.id],
    }),
    readingSessions: many(readingSessions),
}));

export const readingSessionsRelations = relations(readingSessions, ({ one }) => ({
    user: one(users, {
        fields: [readingSessions.userId],
        references: [users.id],
    }),
    book: one(books, {
        fields: [readingSessions.bookId],
        references: [books.id],
    }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
    user: one(users, {
        fields: [expenses.userId],
        references: [users.id],
    }),
}));

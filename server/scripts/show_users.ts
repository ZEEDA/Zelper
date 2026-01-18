
import db, { dbAll } from '../src/db';

async function showUsers() {
    try {
        console.log('Querying users from database...');
        const users = await dbAll('SELECT id, email, name, daily_budget, created_at FROM users');
        console.log('Found users:', users);
    } catch (error) {
        console.error('Error querying users:', error);
    }
}

showUsers();

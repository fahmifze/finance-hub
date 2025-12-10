import pool from '../models/db';
import { hashPassword } from '../utils/password';

async function seed() {
  console.log('Seeding database...\n');

  try {
    // Hash the demo password
    const passwordHash = await hashPassword('password123');

    // Insert demo user
    const [result] = await pool.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, currency)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE first_name = 'Demo'`,
      ['demo@example.com', passwordHash, 'Demo', 'User', 'USD']
    );

    console.log('Demo user created/updated');

    // Get demo user ID
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      ['demo@example.com']
    ) as any;

    const userId = users[0].id;
    console.log(`Demo user ID: ${userId}`);

    // Check if expenses already exist
    const [existingExpenses] = await pool.execute(
      'SELECT COUNT(*) as count FROM expenses WHERE user_id = ?',
      [userId]
    ) as any;

    if (existingExpenses[0].count === 0) {
      // Add sample expenses
      const expenses = [
        { categoryId: 1, amount: 25.50, description: 'Lunch at restaurant', daysAgo: 1 },
        { categoryId: 1, amount: 12.00, description: 'Coffee and snacks', daysAgo: 2 },
        { categoryId: 2, amount: 45.00, description: 'Uber ride', daysAgo: 3 },
        { categoryId: 3, amount: 120.00, description: 'Electric bill', daysAgo: 5 },
        { categoryId: 4, amount: 35.00, description: 'Movie tickets', daysAgo: 7 },
        { categoryId: 5, amount: 89.99, description: 'New headphones', daysAgo: 10 },
        { categoryId: 1, amount: 55.00, description: 'Grocery shopping', daysAgo: 12 },
        { categoryId: 6, amount: 50.00, description: 'Pharmacy', daysAgo: 15 },
        { categoryId: 7, amount: 29.99, description: 'Online course', daysAgo: 20 },
        { categoryId: 8, amount: 15.00, description: 'Miscellaneous', daysAgo: 25 },
      ];

      for (const exp of expenses) {
        const expenseDate = new Date();
        expenseDate.setDate(expenseDate.getDate() - exp.daysAgo);

        await pool.execute(
          `INSERT INTO expenses (user_id, category_id, amount, description, expense_date)
           VALUES (?, ?, ?, ?, ?)`,
          [userId, exp.categoryId, exp.amount, exp.description, expenseDate.toISOString().split('T')[0]]
        );
      }
      console.log('Sample expenses added');
    } else {
      console.log('Expenses already exist, skipping...');
    }

    console.log('\n========================================');
    console.log('Seed completed successfully!');
    console.log('========================================');
    console.log('Demo credentials:');
    console.log('  Email:    demo@example.com');
    console.log('  Password: password123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();

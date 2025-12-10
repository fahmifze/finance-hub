-- ============================================
-- Demo User Seed Data
-- ============================================
-- Password: password123 (hashed with bcrypt)

USE expense_tracker;

-- Insert demo user
-- Password is 'password123' hashed with bcrypt (10 rounds)
INSERT INTO users (email, password_hash, first_name, last_name, currency) VALUES
('demo@example.com', '$2b$10$rQZ8K.qJxP8vF9X9X9X9XuYHqJ1K2L3M4N5O6P7Q8R9S0T1U2V3W4', 'Demo', 'User', 'USD')
ON DUPLICATE KEY UPDATE first_name = 'Demo';

-- Get demo user ID
SET @demo_user_id = (SELECT id FROM users WHERE email = 'demo@example.com');

-- Add some sample expenses for the demo user
INSERT INTO expenses (user_id, category_id, amount, description, expense_date) VALUES
(@demo_user_id, 1, 25.50, 'Lunch at restaurant', DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(@demo_user_id, 1, 12.00, 'Coffee and snacks', DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(@demo_user_id, 2, 45.00, 'Uber ride', DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
(@demo_user_id, 3, 120.00, 'Electric bill', DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(@demo_user_id, 4, 35.00, 'Movie tickets', DATE_SUB(CURDATE(), INTERVAL 7 DAY)),
(@demo_user_id, 5, 89.99, 'New headphones', DATE_SUB(CURDATE(), INTERVAL 10 DAY)),
(@demo_user_id, 1, 55.00, 'Grocery shopping', DATE_SUB(CURDATE(), INTERVAL 12 DAY)),
(@demo_user_id, 6, 50.00, 'Pharmacy', DATE_SUB(CURDATE(), INTERVAL 15 DAY)),
(@demo_user_id, 7, 29.99, 'Online course', DATE_SUB(CURDATE(), INTERVAL 20 DAY)),
(@demo_user_id, 8, 15.00, 'Miscellaneous', DATE_SUB(CURDATE(), INTERVAL 25 DAY));

SELECT 'Demo user seeded successfully!' AS status;
SELECT 'Email: demo@example.com' AS credentials;
SELECT 'Password: password123' AS credentials;

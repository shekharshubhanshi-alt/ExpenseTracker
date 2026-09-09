USE expense_tracker;

INSERT INTO expenses (title, amount, category, expense_date) VALUES
('Groceries', 1850, 'Groceries', '2026-09-02'),
('Metro recharge', 500, 'Transport', '2026-09-03'),
('Lunch', 320, 'Food', '2026-09-04'),
('Online course', 1200, 'Education', '2026-09-05'),
('Movie', 450, 'Entertainment', '2026-09-06'),
('Electricity bill', 2100, 'Bills', '2026-09-07'),
('Medicine', 650, 'Health', '2026-09-08'),
('Shopping', 1750, 'Shopping', '2026-09-08'),
('Cab', 420, 'Transport', '2026-09-09'),
('Dinner', 600, 'Food', '2026-09-09');

INSERT INTO budgets (category, amount, month, alert_threshold) VALUES
('Food', 5000, '2026-09', 80),
('Transport', 3000, '2026-09', 80),
('Shopping', 5000, '2026-09', 80),
('Bills', 5000, '2026-09', 80);

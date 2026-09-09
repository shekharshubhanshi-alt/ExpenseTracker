# Expense Tracker

A full-stack expense tracking app with an analytics dashboard, built with React, Node.js, Express, and MySQL. Track spending, organize it by category, set a budget, and see where your money's going each month.

## Features

- Add, edit, and delete expenses
- Organize expenses by category
- Set a monthly budget and track spending against it
- Analytics dashboard showing monthly spending trends
- REST API backend with a MySQL database

## Tech Stack

- **Frontend:** React, JavaScript, HTML/CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL

## Project Structure

```text
ExpenseTracker/
├── backend/
│   ├── .env.example
│   ├── db.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── App.jsx
│   ├── index.html
│   ├── main.jsx
│   ├── package.json
│   ├── styles.css
│   └── vite.config.js
├── database/
│   ├── schema.sql
│   └── seed.sql
├── .gitignore
└── README.md
```

## Setup

Clone the repo:
```bash
git clone https://github.com/shekharshubhanshi-alt/ExpenseTracker.git
cd ExpenseTracker
```

**Backend**
```bash
cd backend
npm install
cp .env.example .env   # add your MySQL credentials here
node server.js
```

**Database**
```bash
mysql -u your_username -p your_database < database/schema.sql
```

**Frontend**
```bash
cd frontend
npm install
npm start
```

The app runs on `http://localhost:3000` by default (backend on whatever port you set in `.env`).

## Notes

This was built as a personal project to get hands-on with a full MERN-style stack (minus Mongo, plus MySQL) — going from a raw Express API and a relational schema to a working React frontend, including auth-free CRUD, budget logic, and basic data aggregation for the dashboard charts.

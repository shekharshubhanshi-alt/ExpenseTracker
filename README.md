# Expense Tracker with Analytics Dashboard

A full-stack expense tracking and analytics dashboard built using
React, Node.js, Express.js, and MySQL.

## Features

- Add, edit, and delete expenses
- Category-wise expense tracking
- Monthly spending analytics
- Budget creation and monitoring
- Spending threshold alerts
- Interactive analytics dashboard
- REST API backend
- MySQL persistent storage
- Responsive React interface

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Recharts
- CSS

### Backend
- Node.js
- Express.js
- REST API

### Database
- MySQL

## Architecture

React Frontend
        ↓
REST API
        ↓
Node.js + Express
        ↓
MySQL Database

## Supported Categories

- Food
- Transport
- Shopping
- Bills
- Entertainment
- Health
- Education
- Travel
- Groceries
- Other

## Core Functionality

### Expense Management

Users can add, edit, delete and view expense records.

Each expense contains:

- Title
- Amount
- Category
- Date

### Analytics Dashboard

The dashboard provides:

- Total spending
- Monthly spending
- Category-wise spending
- Transaction count
- Spending trends

### Budget Monitoring

Users can define budgets by category and month.

The dashboard compares actual spending against the configured
budget and displays alerts when spending reaches the defined
threshold.

## Database

MySQL is used for persistent storage.

The database contains:

- Expense records
- Budget information
- Category information
- Date-based transaction data

## Getting Started

### Clone

git clone https://github.com/shekharsubhanshi-alt/ExpenseTracker.git

cd ExpenseTracker

### Database

Create the MySQL database and run:

database/schema.sql

Optional sample data:

database/seed.sql

### Backend

cd backend

npm install

Create `.env` from `.env.example` and configure your MySQL
credentials.

Start the backend:

npm run dev

### Frontend

Open another terminal:

cd frontend

npm install

npm run dev

## API

### Expenses

GET    /api/expenses
POST   /api/expenses
PUT    /api/expenses/:id
DELETE /api/expenses/:id

### Analytics

GET /api/analytics/summary
GET /api/analytics/monthly
GET /api/analytics/categories

### Budgets

GET    /api/budgets
POST   /api/budgets
DELETE /api/budgets/:id

## Project Structure

ExpenseTracker/
├── backend/
├── frontend/
├── database/
├── .gitignore
└── README.md

## Future Improvements

- Authentication and authorization
- Cloud deployment
- CSV/PDF export
- Recurring expenses
- Mobile application
- Advanced financial insights

## Disclaimer

This project is intended for educational and portfolio purposes.<img width="1196" height="833" alt="image" src="https://github.com/user-attachments/assets/76731613-3381-4892-8b5a-d09b03ca0d58" />

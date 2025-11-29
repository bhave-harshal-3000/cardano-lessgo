# Backend Server

Node.js/Express backend API for FinanceBot with MongoDB integration.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables:
   - The `.env` file is already configured with your MongoDB connection
   - Make sure MongoDB URI is correct

3. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check server and database status

### Users
- `GET /api/users/wallet/:walletAddress` - Get user by wallet address
- `POST /api/users` - Create or get user
- `PUT /api/users/:id` - Update user

### Transactions
- `GET /api/transactions/:userId` - Get all transactions for user
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/:userId/stats` - Get transaction statistics

### Budgets
- `GET /api/budgets/:userId` - Get all budgets for user
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Savings
- `GET /api/savings/:userId` - Get all savings goals for user
- `POST /api/savings` - Create new savings goal
- `PUT /api/savings/:id` - Update savings goal
- `DELETE /api/savings/:id` - Delete savings goal

## Database Models

- **User**: Wallet address, name, email, settings
- **Transaction**: Type, amount, category, date, blockchain hash
- **Budget**: Category, limit, spent amount, period
- **Savings**: Goal name, target amount, current amount, deadline

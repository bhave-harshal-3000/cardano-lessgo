# Budget Planner Agent - Usage Guide

## Overview
The Budget Planner Agent takes **3 simple inputs** from the user and creates a detailed savings plan with budget recommendations.

## 3 Required Inputs

### 1. **Item Name** (What to save for)
   - Examples: "Watch", "Laptop", "Gaming Console", "Vacation"
   - Type: String
   - This is what the user wants to buy

### 2. **Cost** (How much it costs)
   - Examples: 6000, 50000, 25000
   - Type: Number (in ₹)
   - Must be > 0

### 3. **Timeframe** (When to buy it)
   - Flexible format - accepts multiple variations:
     - `"2 months"` 
     - `"60 days"`
     - `"3 weeks"`
     - `"1 year"`
     - `"52 weeks"`
   - Type: String
   - The system converts this to days internally

---

## API Endpoint

### Request
```bash
POST /api/budget-planner/plan

Content-Type: application/json

{
  "itemName": "Watch",
  "cost": 6000,
  "timeframe": "2 months",
  "userId": "user123"
}
```

### Response
```json
{
  "success": true,
  "goal": {
    "itemName": "Watch",
    "cost": 6000,
    "timeframe": "2 months"
  },
  "plan": {
    "goalName": "Watch",
    "savingsRequired": {
      "daily": 100,
      "weekly": 750,
      "monthly": 3000
    },
    "milestones": [
      {
        "week": 1,
        "targetAmount": 750,
        "date": "2025-12-07"
      },
      {
        "week": 4,
        "targetAmount": 3000,
        "date": "2025-12-30"
      },
      {
        "week": 8,
        "targetAmount": 6000,
        "date": "2026-01-30"
      }
    ],
    "budgetCuts": [
      {
        "category": "Dining Out",
        "currentSpending": 500,
        "recommendedSpending": 250,
        "savings": 250,
        "reason": "Reduce eating out once a week"
      },
      {
        "category": "Subscriptions",
        "currentSpending": 500,
        "recommendedSpending": 0,
        "savings": 500,
        "reason": "Pause OTT for 2 months"
      }
    ],
    "tips": [
      "Set up automatic transfer of ₹3000 every 30 days",
      "Track progress against weekly ₹750 target",
      "Cut discretionary spending by ₹950/week",
      "Consider part-time work for extra income"
    ]
  }
}
```

---

## Timeframe Format Examples

The agent is flexible with timeframe input:

| Input | Converts To | Days |
|-------|------------|------|
| "2 months" | 60 days | 60 |
| "60 days" | 60 days | 60 |
| "3 weeks" | 21 days | 21 |
| "1 month" | 30 days | 30 |
| "6 months" | 180 days | 180 |
| "1 year" | 365 days | 365 |
| "2 weeks" | 14 days | 14 |

---

## What the Agent Calculates

### 1. **Savings Breakdown**
   - Daily savings needed
   - Weekly savings needed
   - Monthly savings needed

### 2. **Milestones**
   - Weekly/monthly checkpoints
   - Target amount for each milestone
   - Expected completion date

### 3. **Budget Cut Recommendations**
   - Identifies top spending categories
   - Shows current vs. recommended spending
   - Calculates potential savings per category
   - Provides reasoning for each cut

### 4. **Actionable Tips**
   - Automation strategies
   - Tracking suggestions
   - Alternative income ideas

---

## Examples

### Example 1: Gaming Laptop in 3 Months
```json
{
  "itemName": "Gaming Laptop",
  "cost": 80000,
  "timeframe": "3 months",
  "userId": "user123"
}
```
**Result**: Save ₹888/day or ₹26,666/month

### Example 2: Vacation in 6 Weeks
```json
{
  "itemName": "Vacation",
  "cost": 50000,
  "timeframe": "6 weeks",
  "userId": "user123"
}
```
**Result**: Save ₹1,190/day or ₹8,333/week

### Example 3: iPhone in 90 Days
```json
{
  "itemName": "iPhone",
  "cost": 75000,
  "timeframe": "90 days",
  "userId": "user123"
}
```
**Result**: Save ₹833/day or ₹5,833/week

---

## Error Handling

### Invalid Timeframe
```json
{
  "error": "Invalid timeframe format: abc. Use '2 months', '60 days', '3 weeks', etc."
}
```

### Missing Fields
```json
{
  "error": "Missing required fields",
  "required": ["itemName", "cost", "timeframe", "userId"]
}
```

### Invalid Cost
```json
{
  "error": "Cost must be greater than 0"
}
```

---

## Frontend Integration

### React Component Example
```typescript
const [goal, setGoal] = useState({
  itemName: "",
  cost: 0,
  timeframe: ""
});

const createSavingsPlan = async () => {
  const response = await fetch('/api/budget-planner/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...goal,
      userId: currentUser.id
    })
  });
  
  const data = await response.json();
  setPlan(data.plan); // Display the plan
};
```

---

## Key Features

✅ **Flexible Input** - Accepts various timeframe formats  
✅ **AI-Powered** - Uses Gemini to analyze spending patterns  
✅ **Personalized** - Creates custom budget cuts based on actual spending  
✅ **Milestone-Based** - Breaks goal into achievable weekly/monthly targets  
✅ **Actionable Tips** - Provides practical saving strategies  

---

## Notes

- Timeframe must be in the future (positive days)
- Cost must be a positive number
- The agent uses recent spending data to recommend cuts
- All amounts are in ₹ (Indian Rupees)
- Milestones are calculated automatically based on timeframe

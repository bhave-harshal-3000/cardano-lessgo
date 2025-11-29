# 🧪 Postman Testing Guide - User-Specific Insights

## Overview
Test the complete pipeline: Frontend → Flask → Agent → Export → MongoDB → LLM → Insights

---

## Prerequisites
1. ✅ Backend running: `npm run dev` (port 5001)
2. ✅ AI Backend running: `python app.py` (port 5000)
3. ✅ MongoDB connected and has transactions data
4. ✅ Postman installed

---

## Test Case 1: Export Transactions by UserId

### Request Details
```
Method: GET
URL: http://localhost:5000/insights?userId=692b175b80fe907e83284926
Headers:
  Content-Type: application/json
```

### Steps in Postman:
1. **Create New Request**
   - Click `+ New`
   - Select `HTTP Request`
   - Name: `Get Insights by UserId`

2. **Configure Request**
   - Method: `GET`
   - URL: `http://localhost:5000/insights?userId=692b175b80fe907e83284926`

3. **Send Request**
   - Click `Send`

### Expected Response:
```json
{
  "success": true,
  "keyInsights": [
    {
      "title": "High Expense Pattern",
      "description": "Your spending has increased 40% this month..."
    },
    ...
  ],
  "alerts": [
    {
      "type": "Unusual Transaction",
      "severity": "high",
      "description": "Multiple large transactions detected...",
      "recommendation": "Review recent transactions"
    },
    ...
  ],
  "suggestions": [
    {
      "category": "Savings",
      "suggestion": "Consider setting up automatic savings..."
    },
    ...
  ]
}
```

### Terminal Output to Check:
**AI Backend Console:**
```
🚀 Generating financial insights for userId: 692b175b80fe907e83284926
[INFO] Exporting transactions...
[INFO] Filtering by userId: 692b175b80fe907e83284926
🔍 Filtering by userId: 692b175b80fe907e83284926
✅ Found 416 ROWS selected for CSV export
📊 CSV loaded with 416 ROWS of transaction data
[INFO] Running CrewAI Financial Analyzer with Gemini...
```

**This confirms:**
- ✅ userId received
- ✅ MongoDB filtered correctly (416 rows)
- ✅ CSV created with only this user's data
- ✅ LLM analyzing 416 rows

---

## Test Case 2: Verify Data Isolation (Different UserId)

### Request Details
```
Method: GET
URL: http://localhost:5000/insights?userId=692b0fde18cc3700664fa995
```

### Expected Behavior:
- Should fetch **528 rows** for this different user (from earlier debug output)
- Should return DIFFERENT insights than Test Case 1
- Each user's insights are completely isolated

### Terminal Output:
```
✅ Found 528 ROWS selected for CSV export
📊 CSV loaded with 528 ROWS of transaction data
```

**This proves:** Different users get different transaction counts and insights ✅

---

## Test Case 3: Invalid UserId Format

### Request Details
```
Method: GET
URL: http://localhost:5000/insights?userId=invalid_id
```

### Expected Response:
```json
{
  "success": false,
  "error": "Invalid userId format",
  "message": "Failed to generate insights"
}
```

### Terminal Output:
```
❌ Invalid userId format: invalid_id
```

---

## Test Case 4: Missing UserId (Fallback to All Transactions)

### Request Details
```
Method: GET
URL: http://localhost:5000/insights
(No userId parameter)
```

### Terminal Output:
```
🚀 Generating financial insights for all transactions
[INFO] Exporting transactions...
✅ Found X ROWS selected for CSV export
(X = total of all transactions in system)
```

---

## Test Case 5: Test with WalletAddress (Alternative)

### Request Details
```
Method: GET
URL: http://localhost:5000/insights?wallet_address=some_wallet_address
```

**Note:** userId takes precedence if both are provided

---

## Debugging Tips

### 1. Check CSV Export in Real-Time
- Navigate to: `c:\Users\Lenovo\Desktop\cardano hack\new frontend\cardano-hackathon\ai_backend\`
- Look for: `transactions_export.csv`
- Open it and count rows (exclude header)
- Should match the "Found X ROWS" message

### 2. Monitor Terminal Output
Watch for these key logs:
- `🚀 Generating financial insights for userId: ...`
- `🔍 Filtering by userId: ...`
- `✅ Found X ROWS selected for CSV export`
- `📊 CSV loaded with X ROWS of transaction data`

### 3. Verify Data Isolation
- Compare row counts for different userIds
- Verify insights are different for each user
- Confirm NO cross-user data leakage

### 4. LLM Response Issues
If you get empty/invalid JSON:
- Check that CSV has valid transaction data
- Verify Gemini API key is valid
- Check CrewAI is properly configured
- Look for errors in terminal

---

## Complete Flow Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Postman Request                                              │
│    GET /insights?userId=692b175b80fe907e83284926               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Flask Endpoint (app.py)                                      │
│    ✅ Extracts userId from query parameter                     │
│    ✅ Logs: "Generating insights for userId: ..."             │
│    ✅ Calls: analyze_spending_patterns(user_id=userId)        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Insights Agent (insights_agent.py)                           │
│    ✅ Receives user_id parameter                               │
│    ✅ Calls: export_transactions_to_csv(user_id=user_id)       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Export Script (export_transactions_to_csv.py)               │
│    ✅ Converts userId string → ObjectId                        │
│    ✅ MongoDB Query: {"userId": ObjectId("692b175b...")}      │
│    ✅ Returns: 416 rows only for this user                    │
│    ✅ Exports: transactions_export.csv                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Read CSV & Create Task (insights_agent.py)                  │
│    ✅ Reads: transactions_export.csv (416 rows)               │
│    ✅ Creates: Task with csv_content embedded                 │
│    ✅ ONLY this user's data in the prompt                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Gemini LLM Analysis (CrewAI)                                │
│    ✅ Receives: CSV content (416 rows)                         │
│    ✅ Analyzes: ONLY this user's transactions                 │
│    ✅ Returns: JSON with insights/alerts/suggestions          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. Response to Postman                                          │
│    ✅ Status: 200 OK                                           │
│    ✅ Body: {"success": true, "keyInsights": [...], ...}     │
│    ✅ User sees ONLY their insights                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Postman Collections

### Collection Structure
```
Cardano Insights Testing
├── Test Case 1: Get Insights by UserId (416 rows)
├── Test Case 2: Get Insights Different UserId (528 rows)
├── Test Case 3: Invalid UserId Format
├── Test Case 4: All Transactions (No Filter)
└── Test Case 5: Wallet Address Filter
```

### To Create Collection:
1. Click `File` → `New` → `Collection`
2. Name: `Cardano Insights Testing`
3. Add the 5 requests above
4. Save to `cardano-hackathon\POSTMAN_COLLECTION.json`

---

## Success Criteria

✅ **All tests pass when:**
1. Different userIds return different row counts
2. Each user's insights are unique
3. Terminal shows "Found X ROWS" matching CSV row count
4. Response JSON has valid structure
5. No errors in Flask or AI Backend console
6. Response time < 30 seconds

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Connection refused** | Start Flask: `python app.py` in ai_backend |
| **Invalid userId error** | Use valid 24-char MongoDB ObjectId string |
| **Empty CSV** | Check MongoDB has data for that userId |
| **JSON Parse error** | Gemini response may have markdown, check logs |
| **Timeout** | LLM analysis takes time, increase timeout |
| **404 Not Found** | Verify URL is exactly `/insights` (no extra slashes) |

---

## Next Steps After Testing

1. ✅ Verify all 5 test cases pass
2. ✅ Confirm different userIds get different insights
3. ✅ Test frontend integration (navigate to Insights page)
4. ✅ Deploy to production
5. ✅ Monitor logs for any data leakage

---

**Ready to test? Start with Test Case 1!** 🚀

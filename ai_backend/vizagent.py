"""
Visualization Agent using CrewAI with Gemini LLM
Categorizes transactions and generates visualization data
Returns 5 visualization datasets for frontend rendering
"""

import os
import json
import subprocess
from dotenv import load_dotenv
from crewai import Agent, Task, Crew
from crewai.llm import LLM
from collections import defaultdict, Counter
from datetime import datetime, timedelta
import csv
import webbrowser
from pathlib import Path

# Load environment variables
load_dotenv()

# Initialize Gemini API key
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

# Create Gemini LLM instance
gemini_llm = LLM(
    model="gemini-2.0-flash",
    api_key=GEMINI_API_KEY
)

# ============================
# 📊 VISUALIZATION AGENT
# ============================

viz_agent = Agent(
    role="Data Visualization Specialist",
    goal="Analyze transaction data and categorize expenses for intelligent visualizations",
    backstory=(
        "Expert at analyzing financial data and creating meaningful categories. "
        "You understand spending patterns and can identify smart expense categories beyond standard transaction types."
    ),
    llm=gemini_llm,
    verbose=True
)

# ============================
# 🎨 VISUALIZATION CATEGORIES
# ============================

EXPENSE_CATEGORIES = [
    "Food & Dining",      # Restaurants, groceries, food delivery
    "Essentials",         # Utilities, rent, basic necessities
    "Academics",          # Books, courses, education
    "Luxury & Entertainment",  # Shopping, entertainment, hobbies
    "Transportation",     # Travel, fuel, commute
    "Health & Wellness",  # Medical, gym, health products
]

# ============================
# 📋 HELPER FUNCTIONS
# ============================

def export_transactions_to_csv(user_id: str = None):
    """Run the export script to get fresh transaction data for specific user"""
    try:
        export_script = os.path.join(os.path.dirname(__file__), 'export_transactions_to_csv.py')
        
        cmd = ['python', export_script]
        if user_id:
            cmd.append(user_id)
            print(f"[DEBUG] Exporting for user_id: {user_id}")
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode != 0:
            print(f"[ERROR] Export failed: {result.stderr}")
            return None
        
        csv_path = os.path.join(os.path.dirname(__file__), 'transactions_export.csv')
        if not os.path.exists(csv_path):
            print("[ERROR] CSV file not generated")
            return None
            
        return csv_path
    except Exception as e:
        print(f"[ERROR] Error exporting transactions: {e}")
        import traceback
        traceback.print_exc()
        return None

def read_csv_content(csv_path: str) -> str:
    """Read CSV file content as string"""
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"[ERROR] Failed to read CSV: {e}")
        return ""

def parse_csv_to_dict(csv_path: str) -> list:
    """Parse CSV file to list of dictionaries"""
    try:
        transactions = []
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                transactions.append(row)
        return transactions
    except Exception as e:
        print(f"[ERROR] Failed to parse CSV: {e}")
        return []

# ============================
# 📊 VISUALIZATION BUILDERS
# ============================

def build_category_distribution(transactions: list, categorization: dict) -> dict:
    """
    Viz 1: Category-wise transaction count (Pie Chart)
    Uses Gemini categorization (objectId -> category mapping)
    """
    try:
        category_counts = Counter()
        
        for tx in transactions:
            tx_id = tx.get('_id', '')
            # Get category from Gemini's categorization
            category = categorization.get(tx_id, 'Uncategorized')
            category_counts[category] += 1
        
        # Sort by count (descending)
        sorted_categories = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
        
        return {
            "type": "pie",
            "title": "Transaction Count by Category",
            "data": {
                "labels": [cat[0] for cat in sorted_categories],
                "datasets": [{
                    "data": [cat[1] for cat in sorted_categories],
                    "backgroundColor": [
                        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
                    ]
                }]
            }
        }
    except Exception as e:
        print(f"[ERROR] Building category distribution: {e}")
        return {"error": str(e)}

def build_monthly_spending_trend(transactions: list) -> dict:
    """
    Viz 2: Monthly spending trend (Line Chart)
    Shows total spending per month
    """
    try:
        monthly_spending = defaultdict(float)
        
        for tx in transactions:
            if tx.get('type') == 'expense':
                try:
                    # Parse date (handle multiple formats)
                    date_str = tx.get('date', '')
                    if date_str:
                        # Try ISO format first
                        if 'T' in date_str:
                            date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                        else:
                            # Try other common formats
                            date_obj = datetime.strptime(date_str[:10], '%Y-%m-%d')
                        
                        month_key = date_obj.strftime('%Y-%m')
                        amount = float(tx.get('amount', 0))
                        monthly_spending[month_key] += amount
                except:
                    pass
        
        # Sort by month
        sorted_months = sorted(monthly_spending.items())
        
        return {
            "type": "line",
            "title": "Monthly Spending Trend",
            "data": {
                "labels": [month[0] for month in sorted_months],
                "datasets": [{
                    "label": "Total Spending",
                    "data": [month[1] for month in sorted_months],
                    "borderColor": "#36A2EB",
                    "backgroundColor": "rgba(54, 162, 235, 0.1)",
                    "tension": 0.4
                }]
            }
        }
    except Exception as e:
        print(f"[ERROR] Building monthly spending trend: {e}")
        return {"error": str(e)}

def build_top_categories_by_amount(transactions: list, categorization: dict) -> dict:
    """
    Viz 3: Top spending categories by amount (Bar Chart)
    """
    try:
        category_amounts = defaultdict(float)
        
        for tx in transactions:
            if tx.get('type') == 'expense':
                tx_id = tx.get('_id', '')
                category = categorization.get(tx_id, 'Uncategorized')
                amount = float(tx.get('amount', 0))
                category_amounts[category] += amount
        
        # Sort by amount (descending) and take top 5
        sorted_categories = sorted(category_amounts.items(), key=lambda x: x[1], reverse=True)[:5]
        
        return {
            "type": "bar",
            "title": "Top 5 Spending Categories (by Amount)",
            "data": {
                "labels": [cat[0] for cat in sorted_categories],
                "datasets": [{
                    "label": "Total Amount (₹)",
                    "data": [cat[1] for cat in sorted_categories],
                    "backgroundColor": "#FF6384"
                }]
            }
        }
    except Exception as e:
        print(f"[ERROR] Building top categories: {e}")
        return {"error": str(e)}

def build_payment_method_distribution(transactions: list) -> dict:
    """
    Viz 4: Payment method distribution (Doughnut Chart)
    """
    try:
        payment_methods = Counter()
        
        for tx in transactions:
            method = tx.get('paymentMethod', 'Unknown')
            if method:
                payment_methods[method] += 1
        
        sorted_methods = sorted(payment_methods.items(), key=lambda x: x[1], reverse=True)
        
        return {
            "type": "doughnut",
            "title": "Payment Method Distribution",
            "data": {
                "labels": [method[0] for method in sorted_methods],
                "datasets": [{
                    "data": [method[1] for method in sorted_methods],
                    "backgroundColor": [
                        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"
                    ]
                }]
            }
        }
    except Exception as e:
        print(f"[ERROR] Building payment method distribution: {e}")
        return {"error": str(e)}

def build_income_vs_expense(transactions: list) -> dict:
    """
    Viz 5: Income vs Expense comparison (Stacked Bar Chart)
    """
    try:
        total_income = 0
        total_expense = 0
        
        for tx in transactions:
            amount = float(tx.get('amount', 0))
            if tx.get('type') == 'income':
                total_income += amount
            elif tx.get('type') == 'expense':
                total_expense += amount
        
        return {
            "type": "bar",
            "title": "Income vs Expense",
            "data": {
                "labels": ["Total"],
                "datasets": [
                    {
                        "label": "Income (₹)",
                        "data": [total_income],
                        "backgroundColor": "#4BC0C0"
                    },
                    {
                        "label": "Expense (₹)",
                        "data": [total_expense],
                        "backgroundColor": "#FF6384"
                    }
                ]
            }
        }
    except Exception as e:
        print(f"[ERROR] Building income vs expense: {e}")
        return {"error": str(e)}

# ============================
# 🧠 GEMINI CATEGORIZATION
# ============================

def create_categorization_task(csv_content: str) -> Task:
    """Create task for Gemini to categorize transactions"""
    return Task(
        description=f"""Analyze these transactions and categorize each one into exactly ONE of these categories:
- Food & Dining
- Essentials
- Academics
- Luxury & Entertainment
- Transportation
- Health & Wellness

TRANSACTION DATA:
{csv_content}

For each transaction, return a JSON object mapping the transaction _id to its category.
Return ONLY valid JSON in this exact format (no markdown, no text):

{{
    "objectId1": "Category Name",
    "objectId2": "Category Name",
    ...
}}

Analyze all transactions and categorize each one.""",
        expected_output="JSON object mapping transaction IDs to categories",
        agent=viz_agent,
    )

def get_transaction_categorization(csv_content: str) -> dict:
    """Get transaction categorization from Gemini"""
    try:
        print("[INFO] Creating categorization task...")
        task = create_categorization_task(csv_content)
        
        crew = Crew(
            agents=[viz_agent],
            tasks=[task],
            verbose=True,
        )
        
        print("[INFO] Running categorization crew...")
        result = crew.kickoff()
        
        # Extract JSON from result
        result_str = str(result).strip()
        
        # Find JSON in result
        json_start = result_str.find('{')
        json_end = result_str.rfind('}') + 1
        
        if json_start >= 0 and json_end > json_start:
            json_str = result_str[json_start:json_end]
            categorization = json.loads(json_str)
            print(f"[SUCCESS] Got categorization for {len(categorization)} transactions")
            return categorization
        else:
            print("[WARN] No JSON found in categorization result")
            return {}
        
    except Exception as e:
        print(f"[ERROR] Categorization failed: {e}")
        print("[WARN] Continuing without categorization - using 'Uncategorized' for all transactions")
        import traceback
        traceback.print_exc()
        return {}

# ============================
# 🎬 MAIN VISUALIZATION FUNCTION
# ============================

def generate_html_visualization(data: dict) -> str:
    """Generate HTML with Chart.js visualizations"""
    visualizations = data.get('visualizations', [])
    viz_html_list = []
    
    for idx, viz in enumerate(visualizations):
        if 'error' in viz:
            continue
        
        chart_type = viz.get('type', 'pie')
        title = viz.get('title', f'Visualization {idx+1}')
        chart_data = viz.get('data', {})
        
        # Create canvas ID
        canvas_id = f"chart-{idx}"
        
        # Build chart configuration based on type
        if chart_type == 'pie':
            chart_config = f"""
            {{
                type: 'pie',
                data: {{
                    labels: {json.dumps(chart_data.get('labels', []))},
                    datasets: [{json.dumps(chart_data.get('datasets', [{}])[0])}]
                }},
                options: {{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {{
                        legend: {{position: 'bottom'}},
                        title: {{display: true, text: '{title}'}}
                    }}
                }}
            }}
            """
        elif chart_type == 'line':
            chart_config = f"""
            {{
                type: 'line',
                data: {{
                    labels: {json.dumps(chart_data.get('labels', []))},
                    datasets: {json.dumps(chart_data.get('datasets', []))}
                }},
                options: {{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {{
                        title: {{display: true, text: '{title}'}}
                    }},
                    scales: {{
                        y: {{beginAtZero: true}}
                    }}
                }}
            }}
            """
        elif chart_type == 'bar':
            chart_config = f"""
            {{
                type: 'bar',
                data: {{
                    labels: {json.dumps(chart_data.get('labels', []))},
                    datasets: {json.dumps(chart_data.get('datasets', []))}
                }},
                options: {{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {{
                        title: {{display: true, text: '{title}'}}
                    }},
                    scales: {{
                        y: {{beginAtZero: true}}
                    }}
                }}
            }}
            """
        elif chart_type == 'doughnut':
            chart_config = f"""
            {{
                type: 'doughnut',
                data: {{
                    labels: {json.dumps(chart_data.get('labels', []))},
                    datasets: [{json.dumps(chart_data.get('datasets', [{}])[0])}]
                }},
                options: {{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {{
                        legend: {{position: 'bottom'}},
                        title: {{display: true, text: '{title}'}}
                    }}
                }}
            }}
            """
        else:
            continue
        
        viz_html = f"""
        <div class="chart-container">
            <canvas id="{canvas_id}"></canvas>
        </div>
        <script>
            new Chart(document.getElementById('{canvas_id}'), {chart_config});
        </script>
        """
        viz_html_list.append(viz_html)
    
    # Combine all visualizations into HTML
    all_charts = '\n'.join(viz_html_list)
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cardano Financial Visualizations</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 20px;
                min-height: 100vh;
            }}
            
            .container {{
                max-width: 1400px;
                margin: 0 auto;
            }}
            
            .header {{
                text-align: center;
                color: white;
                margin-bottom: 50px;
            }}
            
            .header h1 {{
                font-size: 3em;
                margin-bottom: 10px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }}
            
            .header p {{
                font-size: 1.1em;
                opacity: 0.9;
            }}
            
            .stats {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 50px;
            }}
            
            .stat-card {{
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                text-align: center;
            }}
            
            .stat-card h3 {{
                color: #667eea;
                font-size: 0.9em;
                text-transform: uppercase;
                margin-bottom: 10px;
                letter-spacing: 1px;
            }}
            
            .stat-card .value {{
                font-size: 2em;
                font-weight: bold;
                color: #333;
            }}
            
            .charts-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
                gap: 30px;
                margin-bottom: 50px;
            }}
            
            .chart-container {{
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                position: relative;
                height: 400px;
            }}
            
            .chart-container canvas {{
                max-height: 350px;
            }}
            
            .footer {{
                text-align: center;
                color: white;
                margin-top: 40px;
                opacity: 0.8;
            }}
            
            @media (max-width: 768px) {{
                .charts-grid {{
                    grid-template-columns: 1fr;
                }}
                
                .header h1 {{
                    font-size: 2em;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💰 Financial Visualizations</h1>
                <p>Cardano Budget Planner - Transaction Analysis</p>
            </div>
            
            <div class="stats">
                <div class="stat-card">
                    <h3>Total Transactions</h3>
                    <div class="value">{data.get('transactionCount', 0)}</div>
                </div>
                <div class="stat-card">
                    <h3>User ID</h3>
                    <div class="value" style="font-size: 0.9em; word-break: break-all;">{data.get('userId', 'N/A')[:20]}...</div>
                </div>
                <div class="stat-card">
                    <h3>Categories Found</h3>
                    <div class="value">{len(set(data.get('categorization', {{}}).values()))}</div>
                </div>
            </div>
            
            <div class="charts-grid">
                {all_charts}
            </div>
            
            <div class="footer">
                <p>Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return html_content

def display_visualizations_in_browser(html_content: str) -> None:
    """Display visualizations in default browser"""
    try:
        # Save HTML to temp file
        html_file = os.path.join(os.path.dirname(__file__), 'visualizations.html')
        
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"[INFO] Visualizations saved to: {html_file}")
        
        # Open in browser
        file_url = f'file:///{os.path.abspath(html_file)}'.replace('\\', '/')
        print(f"[INFO] Opening in browser: {file_url}")
        webbrowser.open(file_url)
        
    except Exception as e:
        print(f"[ERROR] Failed to display visualizations: {e}")

# ============================
# 🎬 MAIN VISUALIZATION FUNCTION
# ============================

def visualize_data(user_id: str = None) -> dict:
    """Main function to generate all 5 visualizations"""
    try:
        print(f"[INFO] Generating visualizations for user: {user_id}")
        
        # Step 1: Export transactions
        print("[INFO] Exporting transactions...")
        csv_path = export_transactions_to_csv(user_id)
        
        if not csv_path:
            return {
                "success": False,
                "error": "Failed to export transactions"
            }
        
        # Step 2: Read CSV content for Gemini
        print("[INFO] Reading CSV content...")
        csv_content = read_csv_content(csv_path)
        
        if not csv_content:
            return {
                "success": False,
                "error": "Failed to read CSV content"
            }
        
        # Step 3: Get categorization from Gemini
        print("[INFO] Getting transaction categorization from Gemini...")
        categorization = get_transaction_categorization(csv_content)
        
        # Step 4: Parse CSV to list of dicts for visualization building
        print("[INFO] Parsing transactions...")
        transactions = parse_csv_to_dict(csv_path)
        
        if not transactions:
            return {
                "success": False,
                "error": "No transactions found"
            }
        
        print(f"[INFO] Building visualizations for {len(transactions)} transactions...")
        
        # Step 5: Build all 5 visualizations
        viz1 = build_category_distribution(transactions, categorization)
        viz2 = build_monthly_spending_trend(transactions)
        viz3 = build_top_categories_by_amount(transactions, categorization)
        viz4 = build_payment_method_distribution(transactions)
        viz5 = build_income_vs_expense(transactions)
        
        result = {
            "success": True,
            "userId": user_id,
            "transactionCount": len(transactions),
            "visualizations": [viz1, viz2, viz3, viz4, viz5],
            "categorization": categorization
        }
        
        # Generate and display HTML visualizations
        print("[INFO] Generating HTML visualizations...")
        html_content = generate_html_visualization(result)
        display_visualizations_in_browser(html_content)
        
        return result
        
    except Exception as e:
        print(f"[ERROR] Visualization failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import sys
    user_id = sys.argv[1] if len(sys.argv) > 1 else None
    result = visualize_data(user_id)
    print(json.dumps(result, indent=2, default=str))

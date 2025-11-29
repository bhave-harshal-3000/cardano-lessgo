#!/usr/bin/env powershell
# Test script for Python HTML parser

Write-Host "🧪 Testing Python HTML Parser..." -ForegroundColor Cyan

# Sample Google Pay HTML from your example
$testHtml = @'
<div class="outer-cell">
  <div class="content-cell">
    Sent ₹100.00 using Bank Account XXXXXXXXXX191807<br />
    Jul 28, 2024, 4:24:58 PM GMT+05:30<br />
  </div>
</div>
<div class="outer-cell">
  <div class="content-cell">
    Received ₹21.00 from Google<br />
    Jul 28, 2024, 4:25:32 PM GMT+05:30<br />
  </div>
</div>
'@

# Write to temp file
$tempFile = "$env:TEMP\test_transactions_$(Get-Random).html"
Set-Content -Path $tempFile -Value $testHtml -Encoding UTF8

Write-Host "📝 Created test HTML file: $tempFile" -ForegroundColor Yellow

# Run Python parser
Write-Host "🐍 Running Python parser..." -ForegroundColor Cyan

$pythonScript = "c:\Users\Lenovo\Desktop\cardano hack\new frontend\cardano-hackathon\ai_backend\parse_html_to_json.py"

python $pythonScript $tempFile 2>&1 | Tee-Object -Variable output

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Parser executed successfully!" -ForegroundColor Green
  Write-Host "`n📊 Parsed output:" -ForegroundColor Cyan
  Write-Host $output
} else {
  Write-Host "❌ Parser failed with exit code: $LASTEXITCODE" -ForegroundColor Red
  Write-Host "Error: $output" -ForegroundColor Red
}

# Cleanup
Remove-Item -Path $tempFile -Force
Write-Host "`n✨ Test complete!" -ForegroundColor Green

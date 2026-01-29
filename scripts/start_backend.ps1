$env:PYTHONPATH = "$PWD\backend"
$env:MONGODB_URI = "mongodb://localhost:27017"
$env:LOG_LEVEL = "INFO"

Write-Host "🚀 Starting SkillSync Backend (Local Mode)..." -ForegroundColor Cyan

# Check Python Environment
$pythonPath = (Get-Command python).Source
Write-Host "Python Path: $pythonPath" -ForegroundColor Gray
python --version

# Force install pydantic-settings if missing (common issue)
Write-Host "Verifying critical dependencies..." -ForegroundColor Yellow
python -m pip install pydantic-settings pydantic>=2.0 --quiet

# Verify import works before starting server
python -c "try:`n  import pydantic_settings`n  print('Dependency Check: OK')`nexcept ImportError as e:`n  print(f'Dependency Check FAILED: {e}')`n  exit(1)"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Critical dependency missing. Please run: pip install pydantic-settings" -ForegroundColor Red
    exit 1
}

# Run the server
Write-Host "Server running at http://localhost:8000" -ForegroundColor Green
Write-Host "Docs available at http://localhost:8000/docs" -ForegroundColor Green

python -m uvicorn app.main:app --app-dir backend --reload --host 0.0.0.0 --port 8000

# SkillSync Development Startup Script

Write-Host "🚀 Starting SkillSync Development Environment..." -ForegroundColor Green

$ROOT_DIR = Get-Location
$BACKEND_DIR = "$ROOT_DIR\graphrag"
$FRONTEND_DIR = "$ROOT_DIR\frontend"

# 1. Start Backend
Write-Host "backend: Starting GraphRAG Service (Port 8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BACKEND_DIR'; Write-Host 'Starting Backend...'; python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

# 2. Start Frontend
Write-Host "frontend: Starting Next.js App (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FRONTEND_DIR'; Write-Host 'Starting Frontend...'; npm run dev"

# 3. Wait for Backend and Seed Data
Write-Host "waiting: Waiting for backend to come online..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get -ErrorAction Stop
    if ($response.status -eq "healthy") {
        Write-Host "backend: Online! Seeding demo data..." -ForegroundColor Green
        try {
            $seed = Invoke-RestMethod -Uri "http://localhost:8000/demo/seed" -Method Post
            Write-Host "seed: $($seed.message) (Nodes: $($seed.graph_nodes))" -ForegroundColor Green
        }
        catch {
            Write-Host "seed: Failed to seed data. $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}
catch {
    Write-Host "backend: Health check failed. Is Uvicorn running?" -ForegroundColor Red
}

Write-Host "✅ Environment started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend:  http://localhost:8000/docs"

# SkillSync Deployment Script
Write-Host "SkillSync Deployment" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

Write-Host "Choose option:" -ForegroundColor Yellow
Write-Host "1. Deploy Backend (Railway)"
Write-Host "2. Deploy Frontend (Vercel)"  
Write-Host "3. Deploy Both"
Write-Host "4. Exit"

$choice = Read-Host "Enter choice (1-4)"

if ($choice -eq "1") {
    Write-Host "Deploying Backend to Railway..." -ForegroundColor Cyan
    if (-not (Test-Path "backend/Procfile")) {
        Write-Host "Procfile not found in backend/" -ForegroundColor Red
        exit 1
    }
    Set-Location backend
    railway login
    railway init
    railway up
    Write-Host "Backend deployed!" -ForegroundColor Green
    Write-Host "Get your URL with: railway domain" -ForegroundColor Cyan
    Set-Location ..
}
elseif ($choice -eq "2") {
    Write-Host "Deploying Frontend to Vercel..." -ForegroundColor Cyan
    Set-Location frontend
    if (-not (Test-Path ".env.production")) {
        if (Test-Path ".env.production.template") {
            Copy-Item ".env.production.template" ".env.production"
            Write-Host "Created .env.production - Please fill in values!" -ForegroundColor Green
            Start-Process notepad ".env.production"
            Read-Host "Press Enter after filling in environment variables"
        }
        else {
            Write-Host "Template not found. Create .env.production manually" -ForegroundColor Red
            exit 1
        }
    }
    vercel login
    vercel --prod
    Write-Host "Frontend deployed!" -ForegroundColor Green
    Set-Location ..
}
elseif ($choice -eq "3") {
    Write-Host "Full Stack Deployment..." -ForegroundColor Cyan
    
    Write-Host "Step 1/2: Backend..." -ForegroundColor Yellow
    Set-Location backend
    railway login
    railway init
    railway up
    Write-Host "Enter your Railway backend URL:" -ForegroundColor Cyan
    $railwayUrl = Read-Host "(e.g., https://skillsync-api.railway.app)"
    Set-Location ..
    
    Write-Host "Step 2/2: Frontend..." -ForegroundColor Yellow
    Set-Location frontend
    if (-not (Test-Path ".env.production")) {
        if (Test-Path ".env.production.template") {
            Copy-Item ".env.production.template" ".env.production"
        }
    }
    if (Test-Path ".env.production") {
        $content = Get-Content ".env.production" -Raw
        $content = $content -replace "NEXT_PUBLIC_BACKEND_URL=.*", "NEXT_PUBLIC_BACKEND_URL=$railwayUrl"
        Set-Content ".env.production" $content
    }
    vercel login
    vercel --prod
    Set-Location ..
    
    Write-Host "Full stack deployed!" -ForegroundColor Green
    Write-Host "Backend: $railwayUrl" -ForegroundColor Cyan
}
elseif ($choice -eq "4") {
    Write-Host "Exiting..." -ForegroundColor Yellow
    exit 0
}
else {
    Write-Host "Invalid choice" -ForegroundColor Red
    exit 1
}

Write-Host "Deployment complete!" -ForegroundColor Green

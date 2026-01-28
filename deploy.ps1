# SkillSync - Quick Deployment Script
# Run this script to deploy to production

Write-Host "🚀 SkillSync Deployment Script" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if required CLIs are installed
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow

# Check Vercel CLI
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
} else {
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
}

# Check Railway CLI
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayInstalled) {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Red
    npm install -g @railway/cli
} else {
    Write-Host "✅ Railway CLI found" -ForegroundColor Green
}

Write-Host "`n================================`n" -ForegroundColor Cyan

# Deployment options
Write-Host "Choose deployment option:" -ForegroundColor Yellow
Write-Host "1. Deploy Backend (Railway)" -ForegroundColor White
Write-Host "2. Deploy Frontend (Vercel)" -ForegroundColor White
Write-Host "3. Deploy Both (Full Stack)" -ForegroundColor White
Write-Host "4. Exit`n" -ForegroundColor White

$choice = Read-Host "Enter choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "`n🔧 Deploying Backend to Railway..." -ForegroundColor Cyan
        
        # Check if Procfile exists
        if (-not (Test-Path "graphrag/Procfile")) {
            Write-Host "❌ Procfile not found in graphrag/ folder" -ForegroundColor Red
            exit 1
        }
        
        cd graphrag
        
        Write-Host "Logging into Railway..." -ForegroundColor Yellow
        railway login
        
        Write-Host "Initializing Railway project..." -ForegroundColor Yellow
        railway init
        
        Write-Host "Deploying to Railway..." -ForegroundColor Yellow
        railway up
        
        Write-Host "`n✅ Backend deployed!" -ForegroundColor Green
        Write-Host "Get your URL with: railway domain" -ForegroundColor Cyan
        
        cd ..
    }
    
    "2" {
        Write-Host "`n🌐 Deploying Frontend to Vercel..." -ForegroundColor Cyan
        
        cd frontend
        
        # Check if .env.production exists
        if (-not (Test-Path ".env.production")) {
            Write-Host "⚠️  .env.production not found" -ForegroundColor Yellow
            Write-Host "Creating from template..." -ForegroundColor Yellow
            
            if (Test-Path ".env.production.template") {
                Copy-Item ".env.production.template" ".env.production"
                Write-Host "✅ Created .env.production - Please fill in values!" -ForegroundColor Green
                Write-Host "Opening file..." -ForegroundColor Yellow
                Start-Process notepad ".env.production"
                
                $continue = Read-Host "`nPress Enter after filling in environment variables..."
            } else {
                Write-Host "❌ Template not found. Please create .env.production manually" -ForegroundColor Red
                exit 1
            }
        }
        
        Write-Host "Logging into Vercel..." -ForegroundColor Yellow
        vercel login
        
        Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
        vercel --prod
        
        Write-Host "`n✅ Frontend deployed!" -ForegroundColor Green
        
        cd ..
    }
    
    "3" {
        Write-Host "`n🚀 Full Stack Deployment Starting..." -ForegroundColor Cyan
        
        # Deploy Backend First
        Write-Host "`n📦 Step 1/2: Deploying Backend..." -ForegroundColor Yellow
        cd graphrag
        railway login
        railway init
        railway up
        
        Write-Host "`nGet your Railway URL:" -ForegroundColor Cyan
        $railwayUrl = Read-Host "Enter your Railway backend URL (e.g., https://skillsync-api.railway.app)"
        
        cd ..
        
        # Deploy Frontend
        Write-Host "`n🌐 Step 2/2: Deploying Frontend..." -ForegroundColor Yellow
        cd frontend
        
        # Update .env.production with backend URL
        if (Test-Path ".env.production") {
            (Get-Content ".env.production") -replace 'NEXT_PUBLIC_GRAPHRAG_URL=.*', "NEXT_PUBLIC_GRAPHRAG_URL=$railwayUrl" | Set-Content ".env.production"
        }
        
        vercel login
        vercel --prod
        
        cd ..
        
        Write-Host "`n✅✅ Full stack deployed successfully!" -ForegroundColor Green
        Write-Host "Backend: $railwayUrl" -ForegroundColor Cyan
        Write-Host "Frontend: Check Vercel dashboard for URL" -ForegroundColor Cyan
    }
    
    "4" {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 0
    }
    
    default {
        Write-Host "Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test your deployed URLs" -ForegroundColor White
Write-Host "2. Configure environment variables in dashboards" -ForegroundColor White
Write-Host "3. Set up MongoDB Atlas if not done" -ForegroundColor White
Write-Host "4. Seed demo data: curl -X POST https://your-backend/demo/seed`n" -ForegroundColor White

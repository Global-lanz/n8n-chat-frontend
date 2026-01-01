# 🧪 Test Script - Valida o build local antes de fazer push
# Execute: .\test-build.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🧪 Testing Frontend Angular Build" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node version
Write-Host "📌 Step 1: Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node -v
Write-Host "Node version: $nodeVersion"

if (-not ($nodeVersion -match "^v20")) {
    Write-Host "❌ Error: Node.js 20.x is required for Angular 18" -ForegroundColor Red
    Write-Host "Current version: $nodeVersion" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js version OK" -ForegroundColor Green
Write-Host ""

# Step 2: Get version from package.json
Write-Host "📌 Step 2: Getting version from package.json..." -ForegroundColor Yellow
$packageJson = Get-Content -Path "package.json" | ConvertFrom-Json
$version = $packageJson.version
Write-Host "Version: $version"
Write-Host "✅ Version extracted successfully" -ForegroundColor Green
Write-Host ""

# Step 3: Install dependencies
Write-Host "📌 Step 3: Installing dependencies..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    npm ci
} else {
    npm install
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 4: Validate Angular build
Write-Host "📌 Step 4: Building Angular application..." -ForegroundColor Yellow
npm run build:prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 5: Check build output
Write-Host "📌 Step 5: Checking build output..." -ForegroundColor Yellow
$buildPath = "dist\chat-n8n-angular\browser"

if (Test-Path $buildPath) {
    Write-Host "Build output directory: $buildPath"
    Write-Host ""
    Write-Host "Files created:"
    Get-ChildItem $buildPath | Format-Table Name, Length, LastWriteTime
    Write-Host ""
    
    # Check for required files
    $allFound = $true
    
    if (Test-Path "$buildPath\index.html") {
        Write-Host "✅ Found: index.html" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: index.html" -ForegroundColor Red
        $allFound = $false
    }
    
    if (Get-ChildItem "$buildPath\main*.js" -ErrorAction SilentlyContinue) {
        Write-Host "✅ Found: main*.js" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: main*.js" -ForegroundColor Red
        $allFound = $false
    }
    
    if (Get-ChildItem "$buildPath\styles*.css" -ErrorAction SilentlyContinue) {
        Write-Host "✅ Found: styles*.css" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: styles*.css" -ForegroundColor Red
        $allFound = $false
    }
    
    if ($allFound) {
        Write-Host "✅ All required files present" -ForegroundColor Green
    } else {
        Write-Host "❌ Some required files are missing" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Build output directory not found: $buildPath" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 6: Test Docker build (optional)
Write-Host "📌 Step 6: Testing Docker build (optional)..." -ForegroundColor Yellow
$response = Read-Host "Do you want to test Docker build? (y/n)"

if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "Building Docker image..." -ForegroundColor Yellow
    docker build -t "test-frontend:$version" .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker build successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Image created: test-frontend:$version"
        Write-Host ""
        Write-Host "To run the container:"
        Write-Host "docker run -p 80:80 -e API_BASE_URL=http://localhost:3000 -e VERSION=$version test-frontend:$version"
    } else {
        Write-Host "❌ Docker build failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⏭️  Skipping Docker build" -ForegroundColor Yellow
}
Write-Host ""

# Step 7: Simulate RC generation
Write-Host "📌 Step 7: Simulating RC version generation..." -ForegroundColor Yellow
$date = Get-Date -Format "yyyyMMdd"
$rcVersion = "RC.$date.001"
Write-Host "RC Version would be: $rcVersion"
Write-Host "✅ RC version format OK" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📊 SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Version:      " -NoNewline; Write-Host "$version" -ForegroundColor Green
Write-Host "Node:         " -NoNewline; Write-Host "$nodeVersion" -ForegroundColor Green
Write-Host "Build:        " -NoNewline; Write-Host "✅ SUCCESS" -ForegroundColor Green
Write-Host "Output:       " -NoNewline; Write-Host "$buildPath" -ForegroundColor Green
Write-Host "RC Format:    " -NoNewline; Write-Host "$rcVersion" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 All tests passed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Commit your changes"
Write-Host "2. Push to GitHub"
Write-Host "3. Create PR with label 'RC' to generate Release Candidate"
Write-Host "   OR"
Write-Host "4. Merge to main for production release"
Write-Host ""

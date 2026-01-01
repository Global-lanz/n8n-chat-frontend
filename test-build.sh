#!/bin/bash

# 🧪 Test Script - Valida o build local antes de fazer push
# Execute: bash test-build.sh

set -e  # Exit on error

echo "========================================"
echo "🧪 Testing Frontend Angular Build"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Node version
echo "📌 Step 1: Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "Node version: $NODE_VERSION"

if [[ ! $NODE_VERSION =~ ^v20 ]]; then
    echo -e "${RED}❌ Error: Node.js 20.x is required for Angular 18${NC}"
    echo "Current version: $NODE_VERSION"
    exit 1
fi
echo -e "${GREEN}✅ Node.js version OK${NC}"
echo ""

# Step 2: Get version from package.json
echo "📌 Step 2: Getting version from package.json..."
VERSION=$(node -p "require('./package.json').version")
echo "Version: $VERSION"
echo -e "${GREEN}✅ Version extracted successfully${NC}"
echo ""

# Step 3: Install dependencies
echo "📌 Step 3: Installing dependencies..."
if [ -f "package-lock.json" ]; then
    npm ci
else
    npm install
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 4: Validate Angular build
echo "📌 Step 4: Building Angular application..."
npm run build:prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi
echo ""

# Step 5: Check build output
echo "📌 Step 5: Checking build output..."
BUILD_PATH="dist/chat-n8n-angular/browser"

if [ -d "$BUILD_PATH" ]; then
    echo "Build output directory: $BUILD_PATH"
    echo ""
    echo "Files created:"
    ls -lh $BUILD_PATH/
    echo ""
    
    # Check for required files
    REQUIRED_FILES=("index.html" "main*.js" "styles*.css")
    ALL_FOUND=true
    
    for pattern in "${REQUIRED_FILES[@]}"; do
        if ls $BUILD_PATH/$pattern 1> /dev/null 2>&1; then
            echo -e "${GREEN}✅ Found: $pattern${NC}"
        else
            echo -e "${RED}❌ Missing: $pattern${NC}"
            ALL_FOUND=false
        fi
    done
    
    if [ "$ALL_FOUND" = true ]; then
        echo -e "${GREEN}✅ All required files present${NC}"
    else
        echo -e "${RED}❌ Some required files are missing${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Build output directory not found: $BUILD_PATH${NC}"
    exit 1
fi
echo ""

# Step 6: Test Docker build (optional)
echo "📌 Step 6: Testing Docker build (optional)..."
echo "Do you want to test Docker build? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "Building Docker image..."
    docker build -t test-frontend:$VERSION .
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Docker build successful!${NC}"
        echo ""
        echo "Image created: test-frontend:$VERSION"
        echo ""
        echo "To run the container:"
        echo "docker run -p 80:80 -e API_BASE_URL=http://localhost:3000 -e VERSION=$VERSION test-frontend:$VERSION"
    else
        echo -e "${RED}❌ Docker build failed!${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⏭️  Skipping Docker build${NC}"
fi
echo ""

# Step 7: Simulate RC generation
echo "📌 Step 7: Simulating RC version generation..."
DATE=$(date +'%Y%m%d')
RC_VERSION="RC.${DATE}.001"
echo "RC Version would be: $RC_VERSION"
echo -e "${GREEN}✅ RC version format OK${NC}"
echo ""

# Summary
echo "========================================"
echo "📊 SUMMARY"
echo "========================================"
echo -e "Version:      ${GREEN}$VERSION${NC}"
echo -e "Node:         ${GREEN}$NODE_VERSION${NC}"
echo -e "Build:        ${GREEN}✅ SUCCESS${NC}"
echo -e "Output:       ${GREEN}$BUILD_PATH${NC}"
echo -e "RC Format:    ${GREEN}$RC_VERSION${NC}"
echo ""
echo "========================================"
echo -e "${GREEN}🎉 All tests passed!${NC}"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Commit your changes"
echo "2. Push to GitHub"
echo "3. Create PR with label 'RC' to generate Release Candidate"
echo "   OR"
echo "4. Merge to main for production release"
echo ""

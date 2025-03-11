#!/bin/bash

# Script to fix linting issues in the HackRPI codebase
echo "🔍 Fixing linting issues in HackRPI Website..."

# First run prettier to fix formatting
echo "🧹 Running Prettier to fix formatting issues..."
npx prettier --write --tab-width=2 --use-tabs .

# Then fix ESLint auto-fixable issues
echo "🛠️ Running ESLint to fix auto-fixable issues..."
npx next lint --fix

# Fix specific issues mentioned in the error output
echo "🔧 Fixing specific issues in files..."

# Fix the 'GoogleMapsWidget' unused variable in event/page.tsx
echo "📝 Fixing event/page.tsx..."
sed -i.bak '/import GoogleMapsWidget/d' app/event/page.tsx && rm -f app/event/page.tsx.bak

# Add React Hook dependencies in 2048/page.tsx
echo "📝 Adding missing React Hook dependencies in 2048/page.tsx..."
# Note: This requires manual intervention as it needs context about how the code is structured

echo "✅ Linting fixes completed! You may still need to manually address some issues."
echo "Run 'npx next lint' to check remaining issues." 
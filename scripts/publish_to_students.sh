#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting publish process to 'main' (Student Branch)...${NC}"

# 1. Check for uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${RED}❌ Error: You have uncommitted changes. Please commit or stash them first.${NC}"
    exit 1
fi

# Save current branch name to switch back later
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$CURRENT_BRANCH" != "solution" ]; then
     echo -e "${YELLOW}⚠️ You are not on the 'solution' branch. Switching to 'solution' first to ensure we have the latest source.${NC}"
     git checkout solution
     git pull origin solution
fi

# 2. Switch to main and update
echo -e "${GREEN}🔄 Switching to 'main' and merging changes from 'solution'...${NC}"
git checkout main
git pull origin main

# Merge solution into main
# We use --no-commit to allow us to remove the solution files before finalizing if needed,
# or simply to have a chance to clean up immediately after.
# Actually, better strategy: Merge, then force remove.
git merge solution --no-edit || {
    echo -e "${RED}💥 Merge conflict! Please resolve conflicts manually, remove solution files if re-added, and commit.${NC}"
    exit 1
}

# 3. Clean up solution files
echo -e "${YELLOW}🧹 Ensuring no solution files exist in 'main'...${NC}"
find . -name "lab-solution.md" -type f -print0 | xargs -0 git rm -f --ignore-unmatch

# 4. Commit the cleanup if there are changes (i.e. if the merge brought back solution files)
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${GREEN}💾 Committing removal of solution files...${NC}"
    git commit -m "chore: Remove solution files after merge from solution"
else
    echo -e "${GREEN}✨ No solution files needed removal.${NC}"
fi

# 5. Push to origin
echo -e "${GREEN}⬆️ Pushing 'main' to origin...${NC}"
git push origin main

# 6. Return to original branch
echo -e "${GREEN}🔙 Returning to branch '$CURRENT_BRANCH'...${NC}"
git checkout $CURRENT_BRANCH

echo -e "${GREEN}✅ Done! Students branch 'main' is up to date and clean.${NC}"

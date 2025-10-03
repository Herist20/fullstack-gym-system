#!/bin/bash

# Gym System - Setup Script
# This script helps you setup the project quickly

set -e

echo "🏋️  Gym Management System - Setup Script"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check Node.js
echo "Checking prerequisites..."
if command_exists node; then
    NODE_VERSION=$(node -v)
    print_success "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js not found!"
    echo "Please install Node.js v18+ from https://nodejs.org"
    exit 1
fi

# Check pnpm
if command_exists pnpm; then
    PNPM_VERSION=$(pnpm -v)
    print_success "pnpm installed: $PNPM_VERSION"
else
    print_warning "pnpm not found. Installing pnpm..."
    npm install -g pnpm
    print_success "pnpm installed successfully!"
fi

# Check Supabase CLI
if command_exists supabase; then
    SUPABASE_VERSION=$(supabase --version)
    print_success "Supabase CLI installed: $SUPABASE_VERSION"
else
    print_warning "Supabase CLI not found. Installing..."
    npm install -g supabase
    print_success "Supabase CLI installed successfully!"
fi

echo ""
echo "========================================"
echo "Step 1: Installing dependencies..."
echo "========================================"
pnpm install
print_success "Dependencies installed!"

echo ""
echo "========================================"
echo "Step 2: Environment Setup"
echo "========================================"

if [ ! -f .env.local ]; then
    cp .env.example .env.local
    print_success ".env.local created from template"
    print_warning "Please edit .env.local with your Supabase credentials"

    echo ""
    print_info "To get Supabase credentials:"
    echo "  1. Go to https://app.supabase.com"
    echo "  2. Create a new project (or use existing)"
    echo "  3. Go to Settings > API"
    echo "  4. Copy Project URL and API keys"
    echo ""

    read -p "Press Enter to open .env.local in editor..." -r
    ${EDITOR:-nano} .env.local
else
    print_info ".env.local already exists"
fi

echo ""
echo "========================================"
echo "Step 3: Supabase Setup"
echo "========================================"

print_info "Do you want to:"
echo "  1) Link to existing Supabase project (Cloud)"
echo "  2) Start local Supabase"
echo "  3) Skip this step"
read -p "Enter choice (1/2/3): " -r SUPABASE_CHOICE

case $SUPABASE_CHOICE in
    1)
        print_info "Linking to Supabase project..."
        read -p "Enter your project ref (from Supabase Dashboard > Settings > General): " -r PROJECT_REF
        supabase login
        supabase link --project-ref "$PROJECT_REF"
        print_success "Linked to Supabase project!"

        echo ""
        print_info "Pushing migrations to Supabase..."
        pnpm db:push
        print_success "Migrations completed!"
        ;;
    2)
        print_info "Starting local Supabase..."
        supabase start
        print_success "Local Supabase started!"

        echo ""
        print_info "Running migrations..."
        supabase db reset
        print_success "Migrations completed!"
        ;;
    3)
        print_info "Skipping Supabase setup"
        ;;
    *)
        print_error "Invalid choice"
        ;;
esac

echo ""
echo "========================================"
echo "Step 4: Seed Data (Optional)"
echo "========================================"

read -p "Do you want to seed the database with sample data? (y/n): " -r SEED_CHOICE
if [[ $SEED_CHOICE =~ ^[Yy]$ ]]; then
    print_info "To seed data:"
    echo "  1. Open Supabase Dashboard"
    echo "  2. Go to SQL Editor"
    echo "  3. Copy paste content from: supabase/seed.sql"
    echo "  4. Click RUN"
    echo ""
    print_warning "Remember to create auth users first!"
    read -p "Press Enter when done..." -r
    print_success "Seed data loaded!"
fi

echo ""
echo "========================================"
echo "🎉 Setup Complete!"
echo "========================================"
echo ""
print_success "Your Gym Management System is ready!"
echo ""
print_info "Next steps:"
echo "  1. Run: ${GREEN}pnpm dev${NC} to start development server"
echo "  2. Open: ${BLUE}http://localhost:3001${NC} (User WebApp)"
echo "  3. Open: ${BLUE}http://localhost:3002${NC} (Admin Dashboard)"
echo ""
print_info "Documentation:"
echo "  - ${YELLOW}RUN_PROJECT.md${NC} - Panduan lengkap (Bahasa Indonesia)"
echo "  - ${YELLOW}QUICKSTART.md${NC} - Quick start guide"
echo "  - ${YELLOW}PROJECT_SUMMARY.md${NC} - Project overview"
echo ""
print_info "Useful commands:"
echo "  - ${GREEN}pnpm dev${NC} - Start development"
echo "  - ${GREEN}pnpm db:push${NC} - Push migrations"
echo "  - ${GREEN}pnpm types:generate${NC} - Generate types"
echo ""
echo "Happy coding! 💪"

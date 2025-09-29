#!/bin/bash
# ========================================
# FENIX-SGCN - Production Deployment Script
# ========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
ENV_FILE=".env"

echo -e "${GREEN}🚀 FENIX-SGCN - Production Deployment${NC}"
echo "======================================"

# 1. Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ Docker is required but not installed.${NC}" >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo -e "${RED}❌ Docker Compose is required but not installed.${NC}" >&2; exit 1; }

# 2. Check environment file
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo -e "${YELLOW}Creating .env from template...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your production values${NC}"
    exit 1
fi

# 3. Create backup directory
echo -e "${YELLOW}📁 Creating backup directory...${NC}"
mkdir -p "$BACKUP_DIR"

# 4. Backup existing data if exists
if docker ps -a | grep -q fenix_db_master_prod; then
    echo -e "${YELLOW}💾 Backing up existing database...${NC}"
    docker exec fenix_db_master_prod pg_dump -U fenix fenix_sgcn | gzip > "$BACKUP_DIR/postgres_backup.sql.gz"
    echo -e "${GREEN}✅ Database backed up to $BACKUP_DIR${NC}"
fi

# 5. Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose -f docker-compose.prod.yml down || true

# 6. Build images
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
docker-compose -f docker-compose.prod.yml build --no-cache

# 7. Start services
echo -e "${YELLOW}🚀 Starting services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# 8. Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 30

# 9. Run database migrations
echo -e "${YELLOW}🗄️ Running database migrations...${NC}"
docker exec fenix_backend_prod npx prisma migrate deploy

# 10. Seed initial data (only on first deployment)
if [ "$1" == "--seed" ]; then
    echo -e "${YELLOW}🌱 Seeding initial data...${NC}"
    docker exec fenix_backend_prod npm run seed
fi

# 11. Health checks
echo -e "${YELLOW}🏥 Running health checks...${NC}"

# Check PostgreSQL
if docker exec fenix_db_master_prod pg_isready; then
    echo -e "${GREEN}✅ PostgreSQL is healthy${NC}"
else
    echo -e "${RED}❌ PostgreSQL is not responding${NC}"
    exit 1
fi

# Check Backend
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend API is healthy${NC}"
else
    echo -e "${RED}❌ Backend API is not responding${NC}"
    exit 1
fi

# Check Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
    echo -e "${RED}❌ Frontend is not responding${NC}"
    exit 1
fi

# Check Dgraph
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Dgraph is healthy${NC}"
else
    echo -e "${RED}❌ Dgraph is not responding${NC}"
    exit 1
fi

# Check Redis
if docker exec fenix_redis_prod redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis is healthy${NC}"
else
    echo -e "${RED}❌ Redis is not responding${NC}"
    exit 1
fi

# 12. Display service URLs
echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo "======================================"
echo -e "${GREEN}📍 Service URLs:${NC}"
echo "  Frontend:    http://localhost:3000"
echo "  Backend API: http://localhost:3001"
echo "  Dgraph:      http://localhost:8080"
echo "  MinIO:       http://localhost:9001"
echo ""
echo -e "${YELLOW}📊 Monitoring:${NC}"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo -e "${YELLOW}🛑 To stop:${NC}"
echo "  docker-compose -f docker-compose.prod.yml down"
echo ""
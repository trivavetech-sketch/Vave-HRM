# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not installed or not in PATH. Please install Docker first."
    exit 1
}

# Check if Docker Compose is installed
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
}

Write-Host "🐳 Spin up local services (Postgres, Redis, Backend, Frontend) via Docker Compose..." -ForegroundColor Cyan

# Run Docker Compose build and start in detached mode
docker-compose -f docker/docker-compose.yml up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "🚀 Vave HRM local cluster started successfully!" -ForegroundColor Green
    Write-Host "--------------------------------------------------------" -ForegroundColor Green
    Write-Host "  Frontend Dashboard : http://localhost:3000" -ForegroundColor Green
    Write-Host "  Backend API Gateway: http://localhost:4000/api/v1" -ForegroundColor Green
    Write-Host "--------------------------------------------------------" -ForegroundColor Green
    Write-Host "To view logs: docker-compose -f docker/docker-compose.yml logs -f" -ForegroundColor Yellow
    Write-Host "To stop services: docker-compose -f docker/docker-compose.yml down" -ForegroundColor Yellow
} else {
    Write-Error "❌ Failed to start local services."
}

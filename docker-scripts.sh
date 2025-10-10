#!/bin/bash

# Docker management scripts for Chaining MCP Server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build       Build the Docker image"
    echo "  start       Start the service using docker compose"
    echo "  stop        Stop the service"
    echo "  restart     Restart the service"
    echo "  logs        Show logs"
    echo "  shell       Open shell in running container"
    echo "  clean       Clean up containers and images"
    echo "  status      Show container status"
    echo "  help        Show this help message"
}

# Function to create data directory if it doesn't exist
ensure_data_dir() {
    if [ ! -d "./data" ]; then
        print_status "Creating data directory..."
        mkdir -p ./data
        chmod 755 ./data
    fi
}

# Function to build the image
build_image() {
    print_header "Building Chaining MCP Server Docker Image"
    ensure_data_dir
    docker compose build --no-cache
    print_status "Build completed successfully!"
}

# Function to start the service
start_service() {
    print_header "Starting Chaining MCP Server"
    ensure_data_dir
    docker compose up -d
    print_status "Service started successfully!"
    print_status "Use '$0 logs' to view logs"
    print_status "Use '$0 status' to check status"
}

# Function to stop the service
stop_service() {
    print_header "Stopping Chaining MCP Server"
    docker compose down
    print_status "Service stopped successfully!"
}

# Function to restart the service
restart_service() {
    print_header "Restarting Chaining MCP Server"
    docker compose down
    ensure_data_dir
    docker compose up -d
    print_status "Service restarted successfully!"
}

# Function to show logs
show_logs() {
    print_header "Chaining MCP Server Logs"
    docker compose logs -f --tail=100
}

# Function to open shell in container
open_shell() {
    print_header "Opening Shell in Container"
    docker compose exec chaining-mcp-server /bin/bash
}

# Function to clean up
cleanup() {
    print_header "Cleaning Up Docker Resources"
    print_warning "This will remove containers, images, and volumes"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker compose down -v --rmi all
        docker system prune -f
        print_status "Cleanup completed!"
    else
        print_status "Cleanup cancelled"
    fi
}

# Function to show status
show_status() {
    print_header "Container Status"
    docker compose ps
    echo ""
    print_header "Resource Usage"
    docker stats --no-stream chaining-mcp-server 2>/dev/null || print_warning "Container not running"
}

# Main script logic
case "${1:-help}" in
    build)
        build_image
        ;;
    start)
        start_service
        ;;
    stop)
        stop_service
        ;;
    restart)
        restart_service
        ;;
    logs)
        show_logs
        ;;
    shell)
        open_shell
        ;;
    clean)
        cleanup
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac

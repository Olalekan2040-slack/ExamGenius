# EduLab ExamPrep - Makefile for common development tasks

.PHONY: help install dev test lint format clean run docker-build docker-run

# Default target
help:
	@echo "EduLab ExamPrep - Available Commands:"
	@echo "  make install       - Install production dependencies"
	@echo "  make dev          - Install development dependencies"
	@echo "  make test         - Run tests with coverage"
	@echo "  make lint         - Run code linters"
	@echo "  make format       - Format code with black"
	@echo "  make clean        - Clean up generated files"
	@echo "  make run          - Run development server"
	@echo "  make init-db      - Initialize database"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-run   - Run Docker container"

# Install production dependencies
install:
	pip install -r requirements.txt

# Install development dependencies
dev:
	pip install -r requirements.txt
	pip install -e ".[dev]"

# Run tests with coverage
test:
	pytest tests/ -v --cov=app --cov-report=html --cov-report=term-missing

# Run linters
lint:
	flake8 app/ tests/
	mypy app/

# Format code
format:
	black app/ tests/ main.py
	isort app/ tests/ main.py

# Clean generated files
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	find . -type d -name "htmlcov" -exec rm -rf {} +
	rm -f .coverage

# Run development server
run:
	uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Initialize database
init-db:
	python scripts/init_db.py

# Docker commands
docker-build:
	docker build -t examgenius:latest .

docker-run:
	docker run -p 8000:8000 --env-file .env examgenius:latest

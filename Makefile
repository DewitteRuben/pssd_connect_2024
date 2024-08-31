up:
	docker compose up -d

build:
	docker compose build

build-frontend:
	npm run build

build-all: build-frontend build

stop:
	docker compose down

down:
	docker compose down && docker compose rm -f

frontend:
	npm run dev
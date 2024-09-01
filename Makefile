up:
	docker compose up -d

build:
	docker compose build

build-frontend:
	npm run build

build-all: build-frontend build

restart-backend:
	docker compose down backend && docker compose up backend -d

build-backend:
	docker compose build backend

update-backend: build-backend restart-backend

stop:
	docker compose down

down:
	docker compose down && docker compose rm -f

frontend:
	npm run dev
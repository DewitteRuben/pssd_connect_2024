up:
	docker compose up backend database -d

build:
	docker compose build

test-backend:
	cd src/backend/src && npm run test

build-bundle:
	npm run build

restart-backend:
	docker compose down backend && docker compose up backend -d

restart-frontend:
	docker compose down frontend && docker compose up frontend -d

build-backend:
	docker compose build backend

build-frontend:
	docker compose build frontend

update-backend: build-backend restart-backend

update-frontend: build-bundle build-frontend restart-frontend

stop:
	docker compose down

down:
	docker compose down && docker compose rm -f

frontend:
	npm run dev

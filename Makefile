up:
	docker compose up

build:
	docker compose build

down:
	docker compose down && docker compose rm -f

frontend:
	npm run dev
mongo:
	docker compose up

frontend:
	npm run dev

backend:
	node ${HOME}/Desktop/Apps/pssd-dating-web/src/backend/dist/src/index.js
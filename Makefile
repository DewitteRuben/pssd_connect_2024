mongo:
	docker compose up

frontend:
	npm run dev

backend:
	node ${HOME}/Desktop/Apps/pssd-dating-web/src/backend/dist/src/index.js

watch_backend:
	cd ${HOME}/Desktop/Apps/pssd-dating-web/src/backend && tsc -w

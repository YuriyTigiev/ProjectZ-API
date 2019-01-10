.PHONY: all help start start-detached stop logs node npm build-prod build

ACCESSCONTAINER = docker-compose exec

all:
	@echo "Project Z setup commands"

	@echo "  make start						- Start the docker-compose stack"
	@echo "  make stop						- Stops the docker-compose stack"
	@echo "  make logs						- Show docker logs"
	@echo "  make node						- Enter the node container"
	@echo "  make npm install			- Enter the node container and runs `npm install`"

help: all

start:
	@docker-compose up

start-detached:
	@docker-compose up -d

stop:
	@docker-compose stop

logs:
	@docker-compose logs -f

node:
	@docker-compose exec back sh

npm:
	@docker-compose exec back sh -c "npm install"


prod:
	@docker-compose exec back sh -c 'npm run build'


build:
	sh -c "docker-compose up -d && docker-compose exec back sh -c 'npm run build' && docker-compose stop"
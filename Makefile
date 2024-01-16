build:
	docker build -t "item-stock-planning-service" .

up:
	docker compose -f docker-compose.local.yml up -d
	docker system prune --force

logs:
	docker compose -f docker-compose.local.yml logs -f

down:
	docker compose -f docker-compose.local.yml down
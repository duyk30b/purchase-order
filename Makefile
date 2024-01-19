build:
	docker build --no-cache -t "smc_purchase_order_service_image" .

up:
	docker compose -f docker-compose.local.yml up -d
	docker compose -f docker-compose.local.yml logs -f

logs:
	docker compose -f docker-compose.local.yml logs -f

down:
	docker compose -f docker-compose.local.yml down

prune:
	docker system prune -a --volumes -f
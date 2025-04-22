cd ..

echo "Starting Portainer..."
docker compose -f docker-compose.portainer.yml up -d

echo "Starting Nginx..."
docker compose -f docker-compose.nginx.yml up -d

echo "Starting app..."
docker compose -f docker-compose.prod.yml up -d

echo "All Started!"
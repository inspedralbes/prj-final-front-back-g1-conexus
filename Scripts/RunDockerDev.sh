cd ../Dockers/Portainer

echo "Starting Portainer..."
docker compose -f docker-compose.prod.yml up -d

cd ../Nginx

echo "Starting Nginx..."
docker compose -f docker-compose.prod.yml up -d

cd ../..

echo "Starting services..."
docker compose -f docker-compose.prod.yml up -d

echo "All Started!"
cd ./Dockers/Portainer

docker compose -f docker-compose.prod.yml up -d

cd ../Nginx

docker compose -f docker-compose.prod.yml up -d

cd ..

docker compose -f docker-compose.prod.yml up -d

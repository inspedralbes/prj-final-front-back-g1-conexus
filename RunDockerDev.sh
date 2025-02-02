cd ./Dockers/Portainer

docker compose up -d

cd ../Nginx

docker compose up -d

cd ..

docker compose up -d

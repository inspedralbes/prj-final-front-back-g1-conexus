cd ../front/appMentoria

rm -rf dist

cp .env.prod .env

pnpm install

pnpm run build

docker restart nginx-db-1

docker restart nginx-app-1


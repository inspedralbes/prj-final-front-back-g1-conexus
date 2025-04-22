cd ../front-vue

rm -rf dist

cd ../

cp .env.prod .env

cd /front-vue

pnpm install

pnpm run build

docker restart nginx-db-1

docker restart nginx-app-1
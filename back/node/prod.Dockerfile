FROM node:23-bookworm-slim

WORKDIR /usr/src/app

RUN npm install -g pnpm && pnpm -vs && npm install -g nodemon
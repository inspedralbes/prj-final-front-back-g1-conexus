FROM node:23-bookworm-slim

WORKDIR /usr/src/app

RUN npm install -g nodemon
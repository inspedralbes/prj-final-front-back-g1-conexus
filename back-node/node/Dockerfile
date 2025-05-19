FROM node:23-alpine3.20

WORKDIR /app

RUN apk add --no-cache bash

COPY package*.json ./

RUN npm ci

RUN npm install -g nodemon

COPY . .

EXPOSE 3000
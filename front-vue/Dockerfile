FROM node:23-alpine3.20

WORKDIR /app

RUN apk add --no-cache bash

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
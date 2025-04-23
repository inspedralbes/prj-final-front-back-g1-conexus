FROM node:23-alpine3.20

WORKDIR /app

RUN apk add --no-cache bash

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 5173

CMD ["node", "index.js"]
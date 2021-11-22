FROM node:14-alpine

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm ci
RUN npm i ts-node

COPY src/ /app/src
COPY utils/ /app/utils
COPY build/ /app/build

COPY .env.prod /app/.env

CMD ["npm", "start"]

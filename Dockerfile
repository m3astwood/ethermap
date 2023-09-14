FROM node:slim

COPY . /app

WORKDIR /app

RUN npm install

RUN cp .env.template .env

RUN npm run migrate:latest

EXPOSE 3000

VOLUME /app/backend/db

ENTRYPOINT ["npm", "run", "dev"]

# => BASE CONTAINER
FROM node:20-slim as base

WORKDIR /app

COPY package*.json .

RUN npm install

FROM base as copy

COPY . /app

# => DEV CONTAINER
FROM copy as dev
# RUN cp .env.template .env
RUN npm run migrate:latest

# => BUILD CONTAINER
FROM copy as build

RUN npm run build

# => PRODUCTION CONTAINER
FROM base as production

COPY --from=build /app/dist /app

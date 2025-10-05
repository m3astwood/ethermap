# => BASE CONTAINER
FROM node:lts-slim as base

WORKDIR /app

COPY . .

RUN npm install

FROM base as copy

# COPY . /app

# => DEV CONTAINER
FROM copy as dev

# => BUILD CONTAINER
FROM copy as build

RUN npm run build

# => PRODUCTION CONTAINER
FROM base as production

COPY --from=build /app/dist /app

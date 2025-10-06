# => BASE CONTAINER
FROM node:lts-slim as dev

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

# => BUILD CONTAINER
FROM dev as build

RUN npm run build

# => PRODUCTION CONTAINER
FROM node:lts-slim as production

WORKDIR /app

COPY package*.json .

RUN npm ci --omit=dev

COPY --from=build /app/dist .

COPY --from=build /app/backend/db/migrations ./backend/db/migrations

CMD [ "node", "server.js"]

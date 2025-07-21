# ethermap

> This is very much a janky _earlydays_ project. All help is welcome!

An interactive map tool. A tool for collaborative planning on maps. Anyone can create new maps, and add, modify and delete locations on any map.

## Install

Ethermap is built in JavaScript using NodeJS. To install you can do so by running the following commands.

To install all dependencies for the front and backend :
```sh
$ npm install
```
You will then need to create a `.env` file in the root folder. There is a `.env.template` that you can copy as a guide. For a dev server you can simply copy and paste the template leaving it as is.

Then migrate the database structure :
```sh
$ npm run migrate:latest
```

Then you should be able to run the dev server :
```sh
$ npm run dev
```

You should now be able to access ethermaps on [http://localhost:3000](http://localhost:3000/) (or whichever port you configured in your `.env` file).

## Tech

### Backend

Backend is running on [express.js](https://expressjs.com/) with [ViteExpress](https://github.com/szymmis/vite-express) bridging the gap between the front and backends.

Database is setup with [Drizzle](https://orm.drizzle.team) and [Postgres](https://www.postgresql.org/).

Live data is shared with the client using [socket.io](https://socket.io/).

Tests are written with [Jest](https://jestjs.io) and route testing uses [supertest](https://github.com/ladjs/supertest).

### Frontend

Frontend is an SPA using [lit](https://lit.dev/) element, state with [ngneat/elf](https://ngneat.github.io/elf/) and some [utilities](https://github.com/thepassle/app-tools) by [Pascal Schilp](https://github.com/thepassle).

Map rendering is done with [leaflet](https://leafletjs.com/).

> On hold : Live rendering of users is done with [socket.io-client](https://socket.io/docs/v4/client-api/).

For the developer environment and building, the frontend is managed by [Vite](https://vitejs.dev/).

## Setup

### Dev

To setup the dev environment you will need a postgres database running, and a `.env` file filled out as per the `.env.sample`. Then do the following :

```sh
$ npm i

$ npm run db:up

$ npm run db:migrate

$ npm run
```

This should have you running ethermap with an empty postgres database.

### Docker

<!-- TODO[MF] These instructions are out of date -->

You can build a development image & run it with the following:

```sh
docker build -t m3astwood/ethermap
docker run -it -p 3000:3000 m3astwood/ethermap
```

## Desires

Minimal viable functionality for this project is the following :

- Anyone can create a map
- Anyone can create, modify and delete points on a map that contain at least
    - name of point
    - notes on said point
- Everyone can see current users _live_
    - users can choose their name
    - users can choose their cursor colour
    - user data should be remembered across visits

Things that ethermap should/could do in the future :

- points
    - edits are all recorded
- users
    - users can chat
    - users can also draw polygons and make labels that are not necessarily "points of interest"
- notes
    - notes should be rich
    - note updates should also be "live"
    - notes should be attributed to users who wrote/edited them
- _osmAnd Sync!_

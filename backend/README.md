# ethermap api

Backend for ethermap

## Install

To install and run the backen you will need [NodeJS](https://nodejs.org/en) and `npm` installed, along with access to Postgresql server (possibility for this to be any database server). Then :

```sh 
$ npm i
```

Once all the packages are installed you should setup your `.env` file (follow the `.env.template`). Once this has all the appropriate entries you can then connect and migrate the database.

```sh 
$ npm run migrate:latest
```

then to run the development server you should run :

```sh 
$ npm run dev
```

## Tech

The backend is made up of a REST api and websocket server. The REST api is built on [Express](https://expressjs.com/) and the websocket server is built on [socket.io](https://socket.io/).

Database interface is the ODM [objection.js](https://vincit.github.io/objection.js/). This setup might not be the best as it was adopted mid-project after starting with just [Knex](https://knexjs.org/) alone.

Tests are written in [Ava](https://github.com/avajs/ava).

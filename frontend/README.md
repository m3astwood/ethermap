# ethermap frontend

Frontend for ethermap 

## Install

To install the frontend you will need [NodeJS](https://nodejs.org/en) and `npm` installed. Then :

```sh 
$ npm i
```

To run the development server run :

```sh 
$ npm run dev
```

## Tech

The interface is built with [LitElement](https://lit.dev/) and setup with [Vite](https://vitejs.dev/) bundler and dev server.

Maps are rendered with [Leaflet](https://leafletjs.com).

For ethermap to work you will also need to be running the [ethermap.api]() server for REST API and Socket.io connectivity.

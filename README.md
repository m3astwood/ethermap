# ethermap 

> This is very much a janky _earlydays_ project. All help is welcome!

An interactive map tool. A tool for collaborative planning on maps. Anyone can create new maps, and add, modify and delete locations on any map.

## Install

Ethermap is built in JavaScript (soz) using NodeJS. To install you can do so by running the following commands.

To install all dependencies for the front and backend :
```sh 
$ npm run install:all
```
You will then need to create a `.env` file in the root of the backend. There is a `.env.template` that you can copy as a guide. For a dev server you can simply copy and paste the template leaving it as is.

Then migrate the database structure :
```sh 
$ npm run migrate:latest
```

Then you should be able to run the dev servers :
```sh 
$ npm run dev:all
```

> NOTE : while you can change the server port number, the front end is hardwired to make requests on port 3000, so for now don't change this.

The backend is running on the port that you defined in your `.env` file (by default it is port 3000), and the frontend will be running on the default Vite port `5173`.

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

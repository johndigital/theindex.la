# Index

Nuxt.js-based codebase powering theindex.la

### Development:

1.  `npm i`
2.  `npm run dev`

This will install all dependencies and run Nuxt in development mode, meaning all requests will be server-rendered and any code changes will live-reload.

### Deployment:

All commits to the master branch are automatically built and deployed to [Heroku](https://dashboard.heroku.com/). During this process, Heroku will run the `npm run build` command to create a compiled version of both the server code and all the client assets, and will then run `npm start` to start the server.

You can learn more about running Nuxt as a universal SSR application [here](https://nuxtjs.org/guide/#server-rendered-universal-ssr-).

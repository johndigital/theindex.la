# Index

Statically generated website for theindex.la, powered by Nuxt.

### Development:

1.  `npm i`
2.  `npm run dev`

This will install all dependencies and run Nuxt in development mode, meaning all requests will be server-rendered and any code changes will live-reload.

### Deployment:

All commits to the master branch are automatically built and deployed using [Netlify](https://www.netlify.com/). During this process, Netlify will run the `npm run generate` command to create a static build of the site, and put all resulting files in the /dist folder which gets deployed. You can learn more about Nuxt static site generation [here](https://nuxtjs.org/api/configuration-generate/).

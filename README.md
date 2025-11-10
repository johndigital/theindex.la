# Index

Nuxt.js-based codebase powering theindex.la

### Development:

1.  `npm i`
2.  `npm run dev`

This will install all dependencies and run Nuxt in development mode, meaning all requests will be server-rendered and any code changes will live-reload.

### Static Generation

`npm run generate`

This will build a set of static files into the `/dist` folder that make up the entirety of the site.

You can serve them locally to test what deployment will look like by running:

`npx serve dist`

### Deployment

When the development is in a good place, and your local preview of the generated files is looking good, all you need to do is deploy the files to a static host. Netlify, Vercel, Cloudflare Pages, any of these will do.

If the host is building, then it should run:
`npm run generate`

And when it serves, it should serve the `/dist` folder. That's it!

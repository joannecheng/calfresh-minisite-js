# CalFresh Minisite

# Development

## Architecture
* `index.html` The main site
* `src/` Location of all JavaScript and Sass files
* `src/js/index.js` Main entry point for JavaScript
* `assets/` Static assets (images, data sources)

## Install dependencies

```
yarn install
```


## Develop locally with webpack-dev-server
1. Run

These two commands will watch your JavaScript and your Sass files.

```
yarn start
yarn watch-sass
```

2. In your browser, navigate to: [http://localhost:8080/](http://localhost:8080/)
## For bundled output

```
npm run build
```

## For production-ready output

```
npm run build:prod
```

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

# Production

## To deploy

To deploy on GitHub pages, I wrote a very simple deploy script at `deploy.sh`.
When all of your changes on `master` have been committed or stashed, you can run
the script to see all your changes on GitHub pages.


## For production-ready output

```
yarn build-sass # output to css folder
yarn build-js # output to bundle.js
```

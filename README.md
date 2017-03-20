<p align="center">
  <img alt="(pretty picture)" src="public/favicon.png" />
</p>

<h1 align="center">
  <a href="https://github.com/karimsa/delish">DELISH</a>
</h1>

<p align="center">
  <a href="https://travis-ci.org/karimsa/delish">
    <img src="https://travis-ci.org/karimsa/delish.svg?branch=master" />
  </a>

  <a href="https://codecov.io/gh/karimsa/delish">
    <img src="https://codecov.io/gh/karimsa/delish/branch/master/graph/badge.svg" alt="Codecov" />
  </a>
</p>

Find your love. Then eat it.

## Running the app

*For a complete API reference, click [here](http://alibhai.co/delish).*

### Development

To run in development mode, run `npm run watch` which will start the backend
and `gulp watch` concurrently. Editing source files will cause a recompile, but
not a livereload in node nor in the browser - so either restart the watch task for
node or refresh your browser.

### Production

This application is built to be deployed on Heroku. Simply run `heroku create`
to setup the app and then `git push heroku master` to get the app going.

## License

Copyright &copy; 2017 Karim Alibhai.

Licensed under [MIT license](LICENSE).
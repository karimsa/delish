<p align="center">
  <img alt="(pretty picture)" src="public/favicon.png" />
</p>

<h1 align="center">
  <a href="https://stormy-wave-24728.herokuapp.com">DELISH</a>
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

For both development and production, the application needs a Google Places API
access key to be provided. This key can be saved in a file called `env.json` in the
root of the project. Here's a sample `env.json` file:

```json
{
  "API_KEY": "key goes here"
}
```

In deployment servers, you can set this as an env variable directly.

### Development

For the development server to be able to resolve geolocation properly (in Safari),
the server uses SSL via self-signed certificates in development environments. To set
this up, go into the `ssl/` directory and run `./gen.sh`.

To run in development mode, run `npm run watch` which will start the backend
and `gulp watch` concurrently. Editing source files will cause a recompile, but
not a livereload in node nor in the browser - so either restart the watch task for
node or refresh your browser for the public code.

### Testing

Continuous Integration + Deployment is configured on Travis CI for Heroku deployment.
To setup your own CI, ensure that the following environment variables are defined:

 - **NODE_ENV = test**: the NODE_ENV variable (unofficially) defines for applications what environment
 we are running in and the tests use this variable to do things.
 - **BROWSERSTACK_USERNAME**: your username on BrowserStack.
 - **BROWSERSTACK_ACCESS_KEY**: the access key given to you by BrowserStack.

These two pieces of information are also provided to Travis so that the local binary
of BrowserStack can be downloaded and run (for testing against a private server). If you
use a different CI, you have to write a script to run BrowserStack as well.

The selenium drivers used by protractor rely on JRE 8+ (< 8 will cause a wrong class version
error).

To test the server code, run `npm run test-server`.

To test the browser code, run `npm run test-browser` (assuming that BrowserStack is running).

Code coverage is only provided (via codecov) for server because the Angular team does not
believe in code coverage and therefore no official plugins exist.

Tests for browser are currently non-existent/terrible?. But you get the idea.

### Production

This application is built to be deployed on Heroku. Simply run `heroku create`
to setup the app and then `git push heroku master` to get the app going.

Or if you run with Travis, run `travis setup heroku` to get Travis setup with your
heroku access and deployment will be automated.

## License

Copyright &copy; 2017 Karim Alibhai.

Licensed under [MIT license](LICENSE).
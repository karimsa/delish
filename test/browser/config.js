exports.config = {
  framework: 'mocha',
  seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
  specs: [ 'test-all.js' ],
  commonCapabilities: {
    'browserstack.user': process.env.BROWSERSTACK_USERNAME,
    'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
    build: 'protractor-browserstack',
    'browserstack.debug': true,
    'browserstack.local': true
  },
  multiCapabilities: [
    { browserName: 'chrome' }
  ]
}

exports.config.multiCapabilities.forEach(caps => {
  Object.keys(exports.config.commonCapabilities).forEach(key => {
    caps[key] = caps[key] || exports.config.commonCapabilities[key]
  })
})
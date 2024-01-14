const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultCommandTimeout: 10000,
  waitForAnimations: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--window-size=1540,1400'); // width set to not zoom out (100%), height never becomes more than the available height
        }

        return launchOptions;
      });

      return require('./cypress/plugins/index.js')(on, config)
    },
    excludeSpecPattern: '*~',
  },
})

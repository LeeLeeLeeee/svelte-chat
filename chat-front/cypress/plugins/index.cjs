const { startDevServer } = require('@cypress/vite-dev-server');
const path = require('path');
module.exports = (on, config) => {
  on('dev-server:start', async (options) => {
    return startDevServer({
      options,
      viteConfig: {
        configFile: path.resolve(__dirname, '..', '..', 'svelte.config.js'),
      },
    });
  });

  return config;
};
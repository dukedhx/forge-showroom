const withPlugins = require("next-compose-plugins");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const nextConfig = {
  webpack: config => {
    if (config.resolve.plugins) {
      config.resolve.plugins.push(new TsConfigPathsPlugin());
    } else {
      config.resolve.plugins = [new TsConfigPathsPlugin()];
    }

    return config;
  },
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    FORGE_CLIENT_ID:process.env.FORGE_CLIENT_ID,
    FORGE_CLIENT_SECRET:process.env.FORGE_CLIENT_SECRET,
    FORGE_CALLBACK_URL:process.env.FORGE_CALLBACK_URL
  },
  env: {
    // Will be available on both server and client
    CTF_SPACE_ID: process.env.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN
  }
};

// next.config.js
module.exports = withPlugins([], nextConfig);

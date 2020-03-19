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
    FORGE_CALLBACK_URL:process.env.FORGE_CALLBACK_URL,
    CTF_CDA_ACCESS_TOKEN_INTERNAL:process.env.CTF_CDA_ACCESS_TOKEN_INTERNAL,

    encryptionPassword:process.env.encryptionPassword,
    encryptionSalt:process.env.encryptionSalt,
    back4appUrl: process.env.back4appUrl,
    back4appId: process.env.back4appId,
    back4appKey:process.env.back4appKey,
  },
  env: {

    // Will be available on both server and client
    CTF_SPACE_ID: process.env.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN,
    CTF_CDA_ACCESS_TOKEN_PREVIEW:process.env.CTF_CDA_ACCESS_TOKEN_PREVIEW,
    
  },
  devIndicators: {
   //autoPrerender: false,
 },
 typescript: {
   ignoreDevErrors: false,
 },
};

// next.config.js
module.exports = withPlugins([], nextConfig);

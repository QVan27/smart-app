/** @type {import('next').NextConfig} */
const nextConfig = {}

const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
  publicRuntimeConfig: {
    API_URL: process.env.API_URL,
  }
});

module.exports = nextConfig

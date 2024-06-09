/** @type {import('next').NextConfig} */
const {nextui} = require("@nextui-org/react");

const withPWA = require('next-pwa')({
  dest: 'public',
  runtimeCaching: [
    {
      urlPattern: /\/api\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|css|js)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-resources',
      },
    },
    {
      urlPattern: /^https?.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'html-cache',
      },
    },
  ],
  buildExcludes: [/middleware-manifest.json$/],
  additionalManifestEntries: [
    '/incomes',
    '/expenses',
    '/settings',
  ],
})

module.exports = withPWA({
  pwa: {
    dest: 'public',
    manifest: {
      name: 'FinTrack',
      short_name: 'FinTrack',
      description: 'Завжди знай куди потратив свої гроші',
      background_color: '#ffffff',
      theme_color: '#000000',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
          {
            "src": "/thirteen.svg",
            "sizes": "192x192",
            "type": "icon/svg"
          }
        ],
    },
  },
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
  reactStrictMode: true,
  sassOptions: {
    includePaths: ["./src/assets/styles"],
  },
})
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    build_time: new Date().toISOString(),
  },
  webpack: (config, { defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.ya?ml/,
      use: [
        defaultLoaders.babel,
        {
          loader: 'yaml-loader',
          // options:
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;

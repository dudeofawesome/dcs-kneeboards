const { readFileSync } = require('fs');
const { parse } = require('yaml');

if (process.env.KNEEBOARD == null) {
  throw new Error(`"KNEEBOARD" must be defined in the env`);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    build_time: new Date().toISOString(),
    kneeboard_path: process.env.KNEEBOARD,
    kneeboard: JSON.stringify(
      parse(readFileSync(process.env.KNEEBOARD).toString()),
    ),
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

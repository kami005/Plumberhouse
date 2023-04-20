/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  distDir: 'build',
  env:{
    RECAPTCHA_KEY: '6LcP3NAcAAAAAC5eLQ3LmOTzm-bWcuKRfMsMJ6vR'
  }
}

module.exports = nextConfig

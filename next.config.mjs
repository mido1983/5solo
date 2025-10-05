const csp = [
  "default-src 'self';",
  // Разрешаем Turnstile, Cloudflare, Vercel Live и Insights
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://vercel.live https://*.vercel-insights.com;",
  "style-src 'self' 'unsafe-inline';",
  "img-src 'self' data: blob: https://challenges.cloudflare.com https://vercel.live https://*.vercel-insights.com;",
  "connect-src 'self' https://challenges.cloudflare.com https://vercel.live https://*.vercel-insights.com;",
  "frame-src 'self' https://challenges.cloudflare.com https://vercel.live;",
  "base-uri 'self';",
  "form-action 'self';",
  "frame-ancestors 'none';",
].join(' ');

const nextConfig = {
  experimental: {
    turbo: { rules: {} },
  },
  reactStrictMode: true,
  trailingSlash: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;

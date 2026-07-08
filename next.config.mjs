/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // Same-origin proxy for the backend: the browser only ever talks to this
    // app's origin, so the session cookie is first-party and sameSite: "lax"
    // works even with a separately-hosted backend (audit P0-5). The OAuth
    // provider redirect URIs must point at
    // https://<client-domain>/api/backend/{google,spotify,youtube}/callback
    // in production so Set-Cookie also lands on this origin.
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ??
      process.env.NEXT_PUBLIC_BACKEND_URL ??
      "http://127.0.0.1:3002";
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;

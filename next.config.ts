import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer, webpack }) => {
    // Provide fallbacks for Node.js built-in modules for client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}), // Ensure fallback object exists
        "child_process": false,
        "fs": false,
        "net": false,
        "tls": false,
        "dns": false,
        // mongodb-client-encryption is better handled by IgnorePlugin below
        // but can be added here as `false` if IgnorePlugin is not sufficient
      };
    }

    // Ignore optional MongoDB driver dependencies to prevent bundling issues.
    // The driver is designed to handle the absence of these optional dependencies.
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(mongodb-client-encryption|kerberos|snappy|aws4|@mongodb-js\/zstd)$/,
      })
    );

    return config;
  },
};

export default nextConfig;

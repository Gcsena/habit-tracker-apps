
import type { NextConfig } from "next";
const createPWA = require("next-pwa");

const withPWA = createPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);
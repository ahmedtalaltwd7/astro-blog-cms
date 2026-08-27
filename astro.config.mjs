// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import vercel from "@astrojs/vercel";

const siteUrls = [
  process.env.PUBLIC_SITE_URL,
  process.env.SITE_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_URL,
].filter(Boolean);

function toAllowedDomain(value) {
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    return {
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
    };
  } catch {
    return null;
  }
}

const allowedDomains = [
  ...siteUrls.map(toAllowedDomain).filter(Boolean),
  ...(process.env.VERCEL ? [{ protocol: "https", hostname: "**.vercel.app" }] : []),
];

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), preact()],
  output: "server",
  adapter: vercel(),
  security: {
    allowedDomains,
  },
  image: {
    remotePatterns: [
      { protocol: "https" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});

import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/nextjs-vite";

// Stories live next to the components. `pnpm build-storybook` writes a static build to
// public/storybook, so Next serves it at /storybook on every environment: the live site and the
// frozen submission copy both ship their own Storybook. Images are absolute paths such as /images/...,
// which resolve to the site root, so the build copies no static files. `pnpm storybook` serves public/.
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/nextjs-vite",
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    return config;
  },
};

export default config;

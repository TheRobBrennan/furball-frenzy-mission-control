import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: { default: "space", options: { space: { name: "space", value: "#050816" } } },
    viewport: { options: { phone: { name: "Phone 375", styles: { width: "375px", height: "812px" } } } },
  },
};

export default preview;

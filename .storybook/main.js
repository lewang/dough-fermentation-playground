

/** @type { import('@storybook/preact-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs"
  ],
  "framework": {
    "name": "@storybook/preact-vite",
    "options": {}
  }
};
export default config;
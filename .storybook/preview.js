export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
import "../src/styles/index.scss";

// .storybook/preview.js


export const decorators = [
  (Story) => (
    <div style={{ textAlign: 'center' }}>
      <Story />
    </div>
  ),
];

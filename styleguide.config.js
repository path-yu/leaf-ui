module.exports = {
  propsParser: require('react-docgen-typescript').withDefaultConfig([
    parserOptions,
  ]).parse,
  propFilter: {
    skipPropsWithName: ['as', 'id'],
    skipPropsWithoutDoc: true,
  },
  shouldExtractLiteralValuesFromEnum: true,
};

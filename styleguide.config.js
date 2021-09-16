module.exports = {
  shouldExtractValuesFromUnion: true,
  shouldExtractLiteralValuesFromEnum: true,
  propFilter: {
    skipPropsWithName: ['as', 'id', 'InputHTMLAttributes'],
    skipPropsWithoutDoc: true,
  },
};

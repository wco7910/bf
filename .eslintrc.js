export default {
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['#', './src'],
          ['#config', './config'],
          ['#types', './src/@types'],
        ],
        extensions: ['.ts', '.js', '.json'],
      },
    },
  },
};

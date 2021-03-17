const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  // load on demand css
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),

  // customize theme
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: { '@primary-color': '#4f4c53' },
    },
  }),
);

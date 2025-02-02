// next.config.js
const withLess = require('next-with-less');

module.exports = withLess({
  lessLoaderOptions: {
    lessOptions: {
      modifyVars: {
        'primary-color': '#1DA57A', // Example customization
      },
      javascriptEnabled: true,
    },
  },
});

const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
module.exports = withModuleFederationPlugin({
  name: 'mfeAnalytics',
  exposes: { './Module': './apps/mfe-analytics/src/app/analytics/analytics.routes.ts' },
  shared: { ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }) },
});

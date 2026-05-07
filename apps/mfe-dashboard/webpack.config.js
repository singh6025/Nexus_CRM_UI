const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
module.exports = withModuleFederationPlugin({
  name: 'mfeDashboard',
  exposes: { './Module': './apps/mfe-dashboard/src/app/dashboard/dashboard.routes.ts' },
  shared: { ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }) },
});

const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
module.exports = withModuleFederationPlugin({
  name: 'mfeOpportunities',
  exposes: { './Module': './apps/mfe-opportunities/src/app/opportunities/opportunities.routes.ts' },
  shared: { ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }) },
});

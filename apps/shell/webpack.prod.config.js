const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  remotes: {
    mfeDashboard:     '/remotes/dashboard/remoteEntry.js',
    mfeLeads:         '/remotes/leads/remoteEntry.js',
    mfeOpportunities: '/remotes/opportunities/remoteEntry.js',
    mfeOrders:        '/remotes/orders/remoteEntry.js',
    mfeBuyers:        '/remotes/buyers/remoteEntry.js',
    mfeFarmers:       '/remotes/farmers/remoteEntry.js',
    mfeCommodities:   '/remotes/commodities/remoteEntry.js',
    mfeTickets:       '/remotes/tickets/remoteEntry.js',
    mfeAnalytics:     '/remotes/analytics/remoteEntry.js',
    mfeSettings:      '/remotes/settings/remoteEntry.js',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});

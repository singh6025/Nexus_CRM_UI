export const environment = {
  production: false,
  apiBase: '/api/v1',
  remotes: {
    mfeDashboard:     'http://localhost:4202/remoteEntry.js',
    mfeLeads:         'http://localhost:4203/remoteEntry.js',
    mfeOpportunities: 'http://localhost:4204/remoteEntry.js',
    mfeOrders:        'http://localhost:4205/remoteEntry.js',
    mfeBuyers:        'http://localhost:4206/remoteEntry.js',
    mfeFarmers:       'http://localhost:4207/remoteEntry.js',
    mfeCommodities:   'http://localhost:4208/remoteEntry.js',
    mfeTickets:       'http://localhost:4201/remoteEntry.js',
    mfeAnalytics:     'http://localhost:4209/remoteEntry.js',
    mfeSettings:      'http://localhost:4210/remoteEntry.js',
  },
};

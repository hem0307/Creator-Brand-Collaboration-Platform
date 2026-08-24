import api from './api';

export const analyticsService = {
  getOverviewMetrics: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getCampaignStats: async () => {
    const response = await api.get('/campaigns/me');
    return response.data;
  },

  getApplicationStats: async () => {
    const response = await api.get('/applications/me');
    return response.data;
  }
};

export default analyticsService;

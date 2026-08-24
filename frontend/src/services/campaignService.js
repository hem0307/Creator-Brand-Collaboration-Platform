import api from './api';

export const campaignService = {
  getAllCampaigns: async (params = {}) => {
    const response = await api.get('/campaigns', { params });
    return response.data;
  },

  getCampaignById: async (id) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  getMyCampaigns: async () => {
    const response = await api.get('/campaigns/me');
    return response.data;
  },

  createCampaign: async (campaignData) => {
    const response = await api.post('/campaigns', campaignData);
    return response.data;
  },

  updateCampaign: async (id, campaignData) => {
    const response = await api.put(`/campaigns/${id}`, campaignData);
    return response.data;
  },

  deleteCampaign: async (id) => {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
  },

  applyToCampaign: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  getCampaignApplications: async (campaignId) => {
    const response = await api.get(`/campaigns/${campaignId}/applications`);
    return response.data;
  },

  inviteCreator: async (campaignId, creatorId) => {
    const response = await api.post(`/campaigns/${campaignId}/invite`, { creatorId });
    return response.data;
  }
};

export default campaignService;

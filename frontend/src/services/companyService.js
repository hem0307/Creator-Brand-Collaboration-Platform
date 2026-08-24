import api from './api';

export const companyService = {
  discoverBrands: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/discover/brands?${query}`);
    return response.data;
  },

  getBrandById: async (id) => {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },

  updateCompanyProfile: async (companyData) => {
    const response = await api.put('/brands/profile', companyData);
    return response.data;
  }
};

export default companyService;

import api from './api';

export const creatorService = {
  discoverCreators: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/discover/creators?${query}`);
    return response.data;
  },

  getCreatorById: async (id) => {
    const response = await api.get(`/creators/${id}`);
    return response.data;
  },

  toggleBookmarkCreator: async (id) => {
    const response = await api.post(`/creators/${id}/bookmark`);
    return response.data;
  },

  getBookmarkedCreators: async () => {
    const response = await api.get('/creators/bookmarks');
    return response.data;
  }
};

export default creatorService;

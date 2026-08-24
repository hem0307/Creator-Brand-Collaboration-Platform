import api from './api';

export const messageService = {
  getInboxMessages: async () => {
    const response = await api.get('/messages/inbox');
    return response.data;
  },

  getThreadMessages: async (projectId) => {
    const response = await api.get(`/messages/thread/${projectId}`);
    return response.data;
  },

  sendThreadMessage: async (projectId, text) => {
    const response = await api.post(`/messages/thread/${projectId}`, { text });
    return response.data;
  },

  sendWorkspaceMessage: async (workspaceId, text) => {
    const response = await api.post(`/workspaces/${workspaceId}/messages`, { text });
    return response.data;
  }
};

export default messageService;

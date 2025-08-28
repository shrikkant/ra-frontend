import httpClient from '../axios.config';
import type { 
  Photobooth, 
  PhotoboothFormData, 
  PhotoboothToken, 
  PhotoboothGuest,
  TokenStatus 
} from '../../types/photobooth.types';

export const adminPhotoboothService = {
  createPhotobooth: async (data: PhotoboothFormData): Promise<Photobooth> => {
    const response = await httpClient.post('/v1/admin/photobooth', data);
    return response;
  },

  listPhotobooths: async (isActive?: boolean): Promise<Photobooth[]> => {
    const url = isActive !== undefined 
      ? `/v1/admin/photobooth?isActive=${isActive}`
      : '/v1/admin/photobooth';
    const response = await httpClient.get(url);
    return response || [];
  },

  getPhotoboothById: async (id: number): Promise<Photobooth> => {
    const response = await httpClient.get(`/v1/admin/photobooth/${id}`);
    return response;
  },

  updatePhotobooth: async (id: number, data: Partial<PhotoboothFormData>): Promise<Photobooth> => {
    const response = await httpClient.put(`/v1/admin/photobooth/${id}`, data);
    return response;
  },

  getPhotoboothTokens: async (id: number): Promise<PhotoboothToken[]> => {
    const response = await httpClient.get(`/v1/admin/photobooth/${id}/tokens`);
    return response || [];
  },

  getPhotoboothGuests: async (id: number): Promise<PhotoboothGuest[]> => {
    const response = await httpClient.get(`/v1/admin/photobooth/${id}/guests`);
    return response || [];
  },

  lookupToken: async (id: number, params: { token?: string; phone?: string }): Promise<PhotoboothToken> => {
    const queryParams = new URLSearchParams();
    if (params.token) queryParams.append('token', params.token);
    if (params.phone) queryParams.append('phone', params.phone);
    const url = `/v1/admin/photobooth/${id}/lookup?${queryParams.toString()}`;
    const response = await httpClient.get(url);
    return response;
  },

  updateTokenStatus: async (tokenId: number, status: TokenStatus): Promise<PhotoboothToken> => {
    const response = await httpClient.patch(`/v1/admin/photobooth/token/${tokenId}/status`, { status });
    return response;
  }
};
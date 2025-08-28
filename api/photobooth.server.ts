import { fetchData } from './axios.config';
import type { 
  Photobooth, 
  PhotoboothRegistration, 
  PhotoboothRegistrationResponse 
} from '../types/photobooth.types';

export const photoboothServerService = {
  getPhotoboothBySlug: async (slug: string): Promise<Photobooth> => {
    console.log('Fetching photobooth from server for slug:', slug);
    const response = await fetchData(`v1/photobooth/${slug}`);
    console.log('Server response:', response);
    return response;
  },

  registerGuest: async (
    photoboothId: number,
    data: PhotoboothRegistration
  ): Promise<PhotoboothRegistrationResponse> => {
    const response = await fetchData(`v1/photobooth/${photoboothId}/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }
};
import httpClient from './axios.config'
import type {
  Photobooth,
  PhotoboothRegistration,
  PhotoboothRegistrationResponse,
} from '../types/photobooth.types'

export const photoboothService = {
  getPhotoboothBySlug: async (slug: string): Promise<Photobooth> => {
    const response = await httpClient.get(`/v1/photobooth/${slug}`)

    console.log(response)
    return response
  },

  registerGuest: async (
    photoboothId: number,
    data: PhotoboothRegistration,
  ): Promise<PhotoboothRegistrationResponse> => {
    const response = await httpClient.post(
      `/v1/photobooth/${photoboothId}/register`,
      data,
    )
    return response
  },
}

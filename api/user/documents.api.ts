import {IDocument} from '../../app-store/app-defaults/types'
import httpClient from '../axios.config'

export async function uploadUserDocument(
  file: File,
  documentType: string,
  onProgress?: (progress: {percent: number}) => void,
  onSuccess?: (data: unknown) => void,
  onError?: (error: unknown) => void,
): Promise<unknown> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('document_type', documentType)
  formData.append('side', 'front')
  formData.append('file_name', file.name)
  formData.append('size', file.size.toString())
  formData.append('file_type', file.type)
  formData.append('type', '1')

  return httpClient
    .post('/user/documents/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: ({total, loaded}) => {
        const t = total || 0
        onProgress?.({percent: Math.round((loaded / t) * 100)})
      },
    })
    .then(data => {
      onSuccess?.(data)
      return data
    })
    .catch(error => {
      onError?.(error)
      throw error
    })
}

export async function getUserDocuments(): Promise<IDocument[]> {
  return httpClient.get<IDocument[]>('/user/documents')
}

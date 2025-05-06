import httpClient from '../axios.config'
import {IDocument} from '../../app-store/app-defaults/types'

export type DocumentType =
  | 'utility_bill'
  | 'driving_license'
  | 'passport'
  | 'pan_card'
  | 'bank_statement'
  | 'rent_agreement'
  | 'index2'

interface DocumentVerificationResponse {
  name: string
  details: string
}

interface DocumentDetailsResponse {
  data: unknown
}

const getDocumentVerificationUrl = (
  userId: number,
  documentId: number,
): string => {
  const baseUrl = '/v1/users'
  return `${baseUrl}/${userId}/documents/${documentId}/`
}

export async function verifyDocument(
  userId: number,
  internalDocumentId: number,
): Promise<unknown> {
  debugger
  const url = getDocumentVerificationUrl(userId, internalDocumentId)
  const response = await httpClient.put<IDocument>(url + 'verify', {
    userId,
  })
  return response
}

export async function fetchDocumentDetails(
  userId: number,
  internalDocumentId: number,
  documentId: string,
  dateOfBirth: string,
): Promise<unknown> {
  const url = getDocumentVerificationUrl(userId, internalDocumentId)
  const response = await httpClient.post<any>(url, {
    id_number: documentId,
    dob: dateOfBirth,
  })
  console.log('Response : ', response)
  return response
}

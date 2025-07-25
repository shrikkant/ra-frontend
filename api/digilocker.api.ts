import {DIGILOCKER_CONFIG} from '../config/digilocker.config'
import {fetchData, HttpService} from './axios.config'
import {ENV_CONFIG} from '../config/environment'
// import {fetchData} from '../app/utils/api'

export interface VerificationData {
  client_id: string
  gateway: string
  token: string
  url: string
  expiry_seconds: number
}

export interface AadhaarData {
  // Add specific aadhaar data structure as needed
  [key: string]: any
}

export interface VerificationResponse {
  resultFormatted: {
    data: VerificationData
  }
}

export interface UserVerificationRequest {
  verificationData: any
  aadhaarData: AadhaarData
}

class DigiLockerAPI {
  private baseURL = '/api/v1/digilocker/'

  async initializeVerification(): Promise<VerificationData> {
    const service = new HttpService(ENV_CONFIG.DIGILOCKER_API_URL)
    const client = service.getClient()
    const response = await client.post(
      `digilocker/initialize`,
      {
        data: {
          signup_flow: true,
          logo_url: DIGILOCKER_CONFIG.LOGO_URL,
          skip_main_screen: false,
          webhook_url: `${ENV_CONFIG.DIGILOCKER_API_URL}/digilocker/webhook`,
        },
      },
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    console.log('initializeVerification response', response)
    return response
  }

  async downloadAadhaarData(clientId: string): Promise<AadhaarData> {
    const service = new HttpService(ENV_CONFIG.DIGILOCKER_API_URL)
    const client = service.getClient()
    const response = await client.get(`digilocker/download-aadhaar/${clientId}`)

    if (!response.ok) {
      throw new Error('Failed to download Aadhaar data')
    }

    console.log('downloadAadhaarData response', response)
    return response
  }

  async verifyUser(request: UserVerificationRequest): Promise<any> {
    console.log('request', request)
    const service = new HttpService()
    const client = service.getClient()
    const response = await client.put('/user?mode=5', request.aadhaarData)

    return response
  }
}

export const digiLockerAPI = new DigiLockerAPI()

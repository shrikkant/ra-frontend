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
    const service = new HttpService(ENV_CONFIG.CLIENT_API_V1_URL)
    const client = service.getClient()
    const response = await client.post(
      `digilocker/initialize`,
      {
        data: {
          signup_flow: true,
          logo_url: DIGILOCKER_CONFIG.LOGO_URL,
          skip_main_screen: true,
          webhook_url: `https://rentacross.com/api/v1/digilocker/webhook`,
        },
      },
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    return response.data
  }

  async handleVerification(clientId: string): Promise<AadhaarData> {
    const service = new HttpService(ENV_CONFIG.CLIENT_API_V1_URL)
    const client = service.getClient()
    const response = await client.post(`digilocker/webhook`, {
      data: {
        client_id: clientId,
        status: 'success',
        type: 'digilocker',
      },
    })

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

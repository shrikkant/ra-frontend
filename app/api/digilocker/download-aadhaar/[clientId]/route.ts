import {NextRequest, NextResponse} from 'next/server'

export async function GET(
  request: NextRequest,
  {params}: {params: Promise<{clientId: string}>},
) {
  try {
    const {clientId} = await params

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/digilocker/download-aadhaar/${clientId}`,
      {
        headers: {
          Authorization: request.headers.get('authorization') || '',
        },
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, {status: response.status})
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error downloading Aadhaar:', error)
    return NextResponse.json({message: 'Internal server error'}, {status: 500})
  }
}

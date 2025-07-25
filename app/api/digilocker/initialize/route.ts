import {NextRequest, NextResponse} from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/digilocker/initialize`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: request.headers.get('authorization') || '',
        },
        body: JSON.stringify(body),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, {status: response.status})
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error initializing DigiLocker:', error)
    return NextResponse.json({message: 'Internal server error'}, {status: 500})
  }
}

import {notFound} from 'next/navigation'
import {CalendarIcon, MapPinIcon} from '@heroicons/react/24/outline'
import RegistrationForm from '../../../components/photobooth/RegistrationForm'
import {photoboothServerService} from '../../../api/photobooth.server'
import TokenDisplayClient from '../../../components/photobooth/TokenDisplay'
import type {Photobooth} from '../../../types/photobooth.types'

interface PhotoboothPageProps {
  params: Promise<{
    slug: string[]
  }>
}

export default async function PhotoboothPage({params}: PhotoboothPageProps) {
  console.log('PhotoboothPage rendering...')

  const resolvedParams = await params
  console.log('Resolved params:', resolvedParams)

  if (!resolvedParams.slug || resolvedParams.slug.length === 0) {
    console.log('No slug provided')
    notFound()
  }

  const slug = resolvedParams.slug[0]
  console.log('Slug:', slug)

  if (resolvedParams.slug.length === 2 && resolvedParams.slug[1] === 'token') {
    return <TokenDisplay slug={slug} />
  }

  let photobooth: Photobooth
  try {
    console.log('Fetching photobooth for slug:', slug)
    photobooth = await photoboothServerService.getPhotoboothBySlug(slug)
    console.log('Photobooth fetched:', photobooth)
  } catch (error) {
    console.error('Error fetching photobooth:', error)
    notFound()
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-md">
              {photobooth.name}
            </h1>
            {photobooth.description && (
              <p className="text-white/90 text-sm">{photobooth.description}</p>
            )}
          </div>

          <div className="p-8">
            <div className="mb-6 space-y-3">
              {photobooth.location && (
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPinIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{photobooth.location}</span>
                </div>
              )}
              {photobooth.event_date && (
                <div className="flex items-start gap-3 text-gray-600">
                  <CalendarIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    {new Date(photobooth.event_date).toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      },
                    )}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Register for Photo
              </h2>
              <RegistrationForm
                photoboothId={photobooth.id}
                photoboothSlug={slug}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TokenDisplay({slug}: {slug: string}) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <TokenDisplayClient slug={slug} />
    </div>
  )
}

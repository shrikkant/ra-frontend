'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface TokenDisplayProps {
  slug: string;
}

interface RegistrationData {
  fullname: string;
  phone: string;
  token: string;
}

export default function TokenDisplayClient({ slug }: TokenDisplayProps) {
  const router = useRouter();
  const [registration, setRegistration] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const photoboothData = localStorage.getItem(`photobooth_registration_${slug}`) || 
                          Object.keys(localStorage).find(key => key.startsWith('photobooth_registration_'))
                            ?.replace('photobooth_registration_', '');
    
    if (photoboothData) {
      const data = typeof photoboothData === 'string' && photoboothData.includes('{') 
        ? JSON.parse(photoboothData)
        : JSON.parse(localStorage.getItem(`photobooth_registration_${photoboothData}`) || '{}');
      
      setRegistration(data);
    } else {
      router.push(`/photobooth/${slug}`);
    }
    setLoading(false);
  }, [slug, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!registration) {
    return null;
  }

  const handleNewRegistration = () => {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('photobooth_token_') || key.startsWith('photobooth_registration_')
    );
    keys.forEach(key => localStorage.removeItem(key));
    router.push(`/photobooth/${slug}`);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.02]">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-white text-center">
          <CheckCircleIcon className="w-16 h-16 mx-auto mb-3" />
          <h2 className="text-2xl font-bold">Registration Successful!</h2>
          <p className="text-green-50 mt-2">Your photobooth token is ready</p>
        </div>

        <div className="p-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-blue-200 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-xs text-gray-400 font-mono">
              PHOTOBOOTH PASS
            </div>
            
            <div className="text-center space-y-6">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Token Number</p>
                <p className="text-5xl font-bold text-gray-900">
                  {registration.token}
                </p>
              </div>

              <div className="border-t-2 border-dashed border-gray-300 pt-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Name</p>
                    <p className="text-lg font-semibold text-gray-800">{registration.fullname}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-lg font-semibold text-gray-800">{registration.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 text-center">
                Please show this token at the photobooth counter
              </p>
            </div>

            <button
              onClick={handleNewRegistration}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-all"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Register Another Person
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
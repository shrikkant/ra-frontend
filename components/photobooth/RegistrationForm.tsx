'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { photoboothService } from '../../api/photobooth.service';
import type { PhotoboothRegistration } from '../../types/photobooth.types';

interface RegistrationFormProps {
  photoboothId: number;
  photoboothSlug: string;
}

export default function RegistrationForm({ photoboothId, photoboothSlug }: RegistrationFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<PhotoboothRegistration>({
    fullname: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await photoboothService.registerGuest(photoboothId, formData);
      
      localStorage.setItem(`photobooth_token_${photoboothId}`, response.token);
      localStorage.setItem(`photobooth_registration_${photoboothId}`, JSON.stringify({
        fullname: formData.fullname,
        phone: formData.phone,
        token: response.token
      }));
      
      router.push(`/photobooth/${photoboothSlug}/token`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          required
          value={formData.fullname}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          value={formData.phone}
          onChange={handleInputChange}
          pattern="[0-9]{10}"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Enter 10-digit phone number"
        />
        <p className="mt-1 text-xs text-gray-500">Enter 10-digit mobile number without country code</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Registering...' : 'Register for Photobooth'}
      </button>
    </form>
  );
}
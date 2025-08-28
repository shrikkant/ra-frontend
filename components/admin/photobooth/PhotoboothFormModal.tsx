'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Photobooth, PhotoboothFormData } from '../../../types/photobooth.types';

interface PhotoboothFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PhotoboothFormData) => Promise<void>;
  photobooth?: Photobooth | null;
}

export default function PhotoboothFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  photobooth 
}: PhotoboothFormModalProps) {
  const [formData, setFormData] = useState<PhotoboothFormData>({
    name: '',
    slug: '',
    description: '',
    location: '',
    event_date: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (photobooth) {
      setFormData({
        name: photobooth.name || '',
        slug: photobooth.slug || '',
        description: photobooth.description || '',
        location: photobooth.location || '',
        event_date: photobooth.event_date ? photobooth.event_date.split('T')[0] : '',
        is_active: photobooth.is_active !== undefined ? photobooth.is_active : true
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        location: '',
        event_date: '',
        is_active: true
      });
    }
  }, [photobooth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save photobooth:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (name === 'name' && !photobooth) {
      const slugValue = value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      setFormData(prev => ({
        ...prev,
        slug: slugValue
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {photobooth ? 'Edit Photobooth' : 'Add New Photobooth'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              pattern="[a-z0-9-]+"
            />
            <p className="text-xs text-gray-500 mt-1">URL: /photobooth/{formData.slug}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Date
            </label>
            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : photobooth ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
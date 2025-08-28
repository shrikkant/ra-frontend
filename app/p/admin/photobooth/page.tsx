'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, PencilIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { adminPhotoboothService } from '../../../../api/admin/photobooth.service';
import PhotoboothFormModal from '../../../../components/admin/photobooth/PhotoboothFormModal';
import type { Photobooth, PhotoboothFormData } from '../../../../types/photobooth.types';

export default function AdminPhotoboothListPage() {
  const [photobooths, setPhotobooths] = useState<Photobooth[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPhotobooth, setEditingPhotobooth] = useState<Photobooth | null>(null);

  useEffect(() => {
    loadPhotobooths();
  }, []);

  const loadPhotobooths = async () => {
    try {
      setLoading(true);
      const data = await adminPhotoboothService.listPhotobooths();
      setPhotobooths(data);
    } catch (error) {
      console.error('Failed to load photobooths:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: PhotoboothFormData) => {
    try {
      if (editingPhotobooth) {
        await adminPhotoboothService.updatePhotobooth(editingPhotobooth.id, data);
      } else {
        await adminPhotoboothService.createPhotobooth(data);
      }
      await loadPhotobooths();
      setModalOpen(false);
      setEditingPhotobooth(null);
    } catch (error) {
      console.error('Failed to save photobooth:', error);
      throw error;
    }
  };

  const handleEdit = (photobooth: Photobooth) => {
    setEditingPhotobooth(photobooth);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPhotobooth(null);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Photobooth Management</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Photobooth
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : photobooths.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No photobooths found</p>
          <button
            onClick={handleAdd}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first photobooth
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {photobooths.map((photobooth) => (
            <div
              key={photobooth.id}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link
                    href={`/p/admin/photobooth/${photobooth.id}`}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {photobooth.name}
                  </Link>
                  
                  <div className="mt-2 space-y-1">
                    {photobooth.description && (
                      <p className="text-sm text-gray-600">{photobooth.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      {photobooth.location && (
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{photobooth.location}</span>
                        </div>
                      )}
                      {photobooth.event_date && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {new Date(photobooth.event_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          photobooth.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {photobooth.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 mt-2">
                      URL: /photobooth/{photobooth.slug}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleEdit(photobooth)}
                  className="ml-4 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PhotoboothFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingPhotobooth(null);
        }}
        onSubmit={handleCreateOrUpdate}
        photobooth={editingPhotobooth}
      />
    </div>
  );
}
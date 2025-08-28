'use client';

import { useState } from 'react';
import { XMarkIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { PhotoboothToken, TokenStatus } from '../../../types/photobooth.types';

interface TokenModalProps {
  token: PhotoboothToken | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (tokenId: number, status: TokenStatus) => Promise<void>;
}

export default function TokenModal({ token, isOpen, onClose, onStatusUpdate }: TokenModalProps) {
  const [updating, setUpdating] = useState(false);

  if (!isOpen || !token) return null;

  // Debug logging to see what data we have
  console.log('Token data in modal:', token);

  const handleStatusUpdate = async (status: TokenStatus) => {
    if (token.status === status) return;
    
    setUpdating(true);
    try {
      await onStatusUpdate(token.id, status);
      onClose();
    } catch (error) {
      console.error('Failed to update token status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = () => {
    switch (token.status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="w-20 h-20 text-green-500" />;
      case 'CANCELLED':
        return <XCircleIcon className="w-20 h-20 text-red-500" />;
      default:
        return <ClockIcon className="w-20 h-20 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (token.status) {
      case 'COMPLETED':
        return 'from-green-500 to-green-600';
      case 'CANCELLED':
        return 'from-red-500 to-red-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
        <div className={`bg-gradient-to-r ${getStatusColor()} p-6 text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center">
            {getStatusIcon()}
            <h2 className="text-2xl font-bold mt-4">Token Details</h2>
            <p className="text-white/90 text-sm mt-1">Status: {token.status}</p>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
            <div className="text-center space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Token Number</p>
                <p className="text-5xl font-bold text-gray-800">{token.token}</p>
              </div>

              <div className="border-t-2 border-dashed border-gray-300 pt-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Name</p>
                    <p className="text-xl font-semibold text-gray-800">{token.guest?.fullname || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-lg font-semibold text-gray-800">{token.guest?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Registered At</p>
                    <p className="text-sm text-gray-600">
                      {new Date(token.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleStatusUpdate('COMPLETED')}
              disabled={updating || token.status === 'COMPLETED'}
              className={`py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                token.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {token.status === 'COMPLETED' ? 'Completed' : 'Mark Complete'}
            </button>
            <button
              onClick={() => handleStatusUpdate('CANCELLED')}
              disabled={updating || token.status === 'CANCELLED'}
              className={`py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                token.status === 'CANCELLED'
                  ? 'bg-red-100 text-red-700 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {token.status === 'CANCELLED' ? 'Cancelled' : 'Mark Cancelled'}
            </button>
          </div>

          {token.status !== 'REGISTERED' && (
            <button
              onClick={() => handleStatusUpdate('REGISTERED')}
              disabled={updating}
              className="w-full mt-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Reset to Registered
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
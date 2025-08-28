'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { adminPhotoboothService } from '../../../../../api/admin/photobooth.service';
import TokenModal from '../../../../../components/admin/photobooth/TokenModal';
import type { Photobooth, PhotoboothToken, TokenStatus } from '../../../../../types/photobooth.types';

export default function AdminPhotoboothDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [photobooth, setPhotobooth] = useState<Photobooth | null>(null);
  const [tokens, setTokens] = useState<PhotoboothToken[]>([]);
  const [allTokens, setAllTokens] = useState<PhotoboothToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selectedToken, setSelectedToken] = useState<PhotoboothToken | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (id) {
      loadPhotoboothData();
    }
  }, [id]);

  const loadPhotoboothData = async () => {
    try {
      setLoading(true);
      const [photoboothData, tokensData] = await Promise.all([
        adminPhotoboothService.getPhotoboothById(id),
        adminPhotoboothService.getPhotoboothTokens(id)
      ]);
      
      setPhotobooth(photoboothData);
      
      // Sort tokens: REGISTERED first (newest first), then COMPLETED, then CANCELLED
      const sortedTokens = tokensData.sort((a, b) => {
        const statusOrder = { REGISTERED: 0, COMPLETED: 1, CANCELLED: 2 };
        if (a.status !== b.status) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        // Within same status, sort by ID descending (newest first)
        return b.id - a.id;
      });
      
      setTokens(sortedTokens);
      setAllTokens(sortedTokens);
    } catch (error) {
      console.error('Failed to load photobooth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setTokens(allTokens);
      return;
    }

    setSearching(true);
    try {
      // Use server-side lookup endpoint
      const result = await adminPhotoboothService.lookupToken(id, { phone: searchQuery });
      // If a single token is found, show it
      setTokens(result ? [result] : []);
    } catch (error) {
      console.error('Search failed:', error);
      // If search fails, show no results
      setTokens([]);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setTokens(allTokens);
  };

  const handleTokenClick = (token: PhotoboothToken) => {
    setSelectedToken(token);
    setModalOpen(true);
  };

  const handleStatusUpdate = async (tokenId: number, status: TokenStatus) => {
    try {
      await adminPhotoboothService.updateTokenStatus(tokenId, status);
      await loadPhotoboothData();
    } catch (error) {
      console.error('Failed to update token status:', error);
      throw error;
    }
  };

  const getStatusBadge = (status: TokenStatus) => {
    const styles = {
      REGISTERED: 'bg-blue-100 text-blue-700 border-blue-200',
      COMPLETED: 'bg-green-100 text-green-700 border-green-200',
      CANCELLED: 'bg-red-100 text-red-700 border-red-200'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!photobooth) {
    return (
      <div className="p-6">
        <p className="text-red-600">Photobooth not found</p>
      </div>
    );
  }

  const stats = {
    total: tokens.length,
    registered: tokens.filter(t => t.status === 'REGISTERED').length,
    completed: tokens.filter(t => t.status === 'COMPLETED').length,
    cancelled: tokens.filter(t => t.status === 'CANCELLED').length
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => router.push('/p/admin/photobooth')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Photobooths
        </button>

        <div className="bg-white rounded-lg border p-6">
          <h1 className="text-2xl font-bold mb-2">{photobooth.name}</h1>
          {photobooth.description && (
            <p className="text-gray-600 mb-2">{photobooth.description}</p>
          )}
          <div className="flex gap-4 text-sm text-gray-500">
            {photobooth.location && <span>📍 {photobooth.location}</span>}
            {photobooth.event_date && (
              <span>📅 {new Date(photobooth.event_date).toLocaleDateString()}</span>
            )}
          </div>
          <div className="mt-4 text-xs text-gray-400">
            Registration URL: /photobooth/{photobooth.slug}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4 text-center">
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-lg border border-blue-200 p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.registered}</p>
          <p className="text-sm text-blue-600">Registered</p>
        </div>
        <div className="bg-white rounded-lg border border-green-200 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-sm text-green-600">Completed</p>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
          <p className="text-sm text-red-600">Cancelled</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b bg-gray-50">
          <div className="flex gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="tel"
                placeholder="Search by mobile number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || searching}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {searching ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                'Search'
              )}
            </button>
          </div>
          {searchQuery && tokens.length === 0 && !searching && (
            <div className="mt-3 text-center text-sm text-gray-500">
              No registrations found for "{searchQuery}"
            </div>
          )}
        </div>

        <div className="divide-y">
          {searching ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Searching...</p>
            </div>
          ) : tokens.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? 'No tokens found matching your search' : 'No registrations yet'}
            </div>
          ) : (
            tokens.map((token) => (
              <div
                key={token.id}
                onClick={() => handleTokenClick(token)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-gray-800">
                        {token.token}
                      </div>
                      {getStatusBadge(token.status)}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">{token.guest?.fullname || 'Unknown'}</span>
                      <span className="mx-2">•</span>
                      <span>{token.guest?.phone || 'No phone'}</span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-400">
                        {new Date(token.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    View Token
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TokenModal
        token={selectedToken}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedToken(null);
        }}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
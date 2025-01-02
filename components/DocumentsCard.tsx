import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
// import { Upload, X, Plus, AlertCircle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import Loader from './Loader';
import { IUser } from '../app-store/types';
import { addDocument, uploadDocument } from '../api/admin/customers.api';
import { IDocument } from '../app-store/app-defaults/types';
import { IoMdRemove } from 'react-icons/io';
// import { Alert, AlertDescription } from '@/components/ui/alert';

const DocumentsCard = ({ user }: { user: IUser }) => {
  const [documents, setDocuments] = useState({
    panCard: {
      front: null,
      requires: ['front'],
      label: 'Pan Card'
    },
    drivingLicense: {
      front: null,
      requires: ['front'],
      label: 'Driving License'
    },
    passport: {
      front: null,
      requires: ['front'],
      label: 'Passport'
    },
    utilityBill: {
      front: null,
      requires: ['front'],
      label: 'Utility Bill'
    },
    bankStatement: {
      front: null,
      requires: ['front'],
      label: 'Bank Statement'
    },
    rentAgreement: {
      front: null,
      back: null,
      requires: ['front'],
      label: 'Rent Agreement'
    },
    // aadharCard: {
    //   front: null,
    //   back: null,
    //   requires: ['front', 'back'],
    //   label: 'Aadhar Card'
    // },

    index2: {
      front: null,
      requires: ['front'],
      label: 'Index 2'
    },
  });

  const [error, setError] = useState('');
  const [uploading, setUploading] = useState({});


  Object.keys(documents).map((docType) => {
    user?.documents?.map((userDoc) => {
      if (docType === userDoc.document_type) {
        if (userDoc.side === 'front') {
          documents[docType].front = {
            file: null,
            preview: "/uploads/" + userDoc.file_name
          };
        }
        if (userDoc.side === 'back') {
          documents[docType].back = {
            file: null,
            preview: "/uploads/" + userDoc.file_name
          };
        }

      }
    });
  });


  const onProgress = (progressEvent) => {

    console.log('Upload progress:', progressEvent);
  }

  const onSuccess = (data, documentType, side) => {
    console.log("Setting Document " + documentType + " <> " + side + " >>>", data);
    setDocuments(prev => ({
      ...prev,
      [documentType]: {
        ...prev[documentType],
        [side]: {
          ...prev[documentType][side],
          preview: "/uploads/" + data.filename,
          serverUrl: data.url, // Store the server URL
          uploadedAt: new Date().toISOString()
        }
      }
    }));

    console.log("Documents >>>", documents);
  }

  const onError = (err) => {
    console.error('Upload failed:', err);
  }

  const uploadToServer = async (file, documentType, side) => {
    // Create form data


    try {
      // Set uploading state for this specific document side
      setUploading(prev => ({
        ...prev,
        [`${documentType}-${side}`]: true
      }));

      const document: IDocument = await addDocument(user.id, documentType, side, file);
      // Make the API call
      uploadDocument(user.id, document?.id, file, documentType, side, onProgress, onSuccess, onError);

    } catch (err) {
      setError(`Failed to upload ${documentType} ${side}: ${err.message}`);
      // Revert the document state on error
      removeFile(documentType, side);
    } finally {
      // Clear uploading state
      setUploading(prev => ({
        ...prev,
        [`${documentType}-${side}`]: false
      }));
    }
  };

  const handleFileUpload = (documentType, side) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size should be less than 5MB');
      return;
    }

    try {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);

      setDocuments(prev => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          [side]: {
            file,
            preview: previewUrl
          }
        }
      }));

      await uploadToServer(file, documentType, side);

      setError('');
    } catch (err) {
      toast.error('Error uploading file. Please try again. ', err);
      // setError('Error uploading file. Please try again.');
    }
  };

  const removeFile = (documentType, side) => {
    setDocuments(prev => {
      const updated = {
        ...prev,
        [documentType]: {
          ...prev[documentType],
          [side]: null
        }
      };

      // Clean up preview URL
      if (prev[documentType][side]?.preview) {
        URL.revokeObjectURL(prev[documentType][side].preview);
      }

      return updated;
    });
  };

  return (
    <div>
      {error && (
        <ToastContainer></ToastContainer>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {Object.entries(documents).map(([docType, doc]) => (
          <div key={docType} className="border rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-lg">{doc.label}</h3>

            <div className="space-y-2">
              {doc.requires.map(side => (
                <div key={`${docType}-${side}`} className="relative">
                  {/* <label className="block text-sm text-gray-600 mb-1">
                    {side.charAt(0).toUpperCase() + side.slice(1)}
                  </label> */}

                  {doc[side] ? (
                    <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={doc[side].preview}
                        alt={`${doc.label} ${side}`}
                        className="object-contain h-full"
                      />

                      {uploading[`${docType}-${side}`] ? (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <Loader />
                        </div>
                      ) : (
                        <button
                          onClick={() => removeFile(docType, side)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 h-auto hidden"
                          disabled={uploading[`${docType}-${side}`]}
                        >
                          <IoMdRemove />
                        </button>)
                      }
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer bg-gray-50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload(docType, side)}
                        className="hidden"
                      />
                      <FaPlus className="h-6 w-6 text-gray-500" />
                      <span className="text-sm text-gray-500">Upload</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsCard;

'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  IdentificationIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { checkGovernmentIdStatus } from '@/app/users/actions';
import GovernmentIdUploadForm from '@/app/bookings/[id]/confirmation/components/GovernmentIdUploadForm';
import { useRouter } from 'next/navigation';

interface GovernmentIdStatusProps {
  userId: string;
}

export default function GovernmentIdStatus({ userId }: GovernmentIdStatusProps) {
  const [idStatus, setIdStatus] = useState<'not_submitted' | 'pending' | 'verified' | 'rejected'>('not_submitted');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  // Separate the fetch function from the useEffect to avoid recreation on each render
  const fetchIdStatus = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the server action
      const response = await checkGovernmentIdStatus(userId);
      
      // Check if the response was successful
      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to fetch ID status');
      }
      
      // Update the ID status based on the response
      if (response.hasGovernmentId) {
        if (response.isVerified) {
          setIdStatus('verified');
        } else {
          setIdStatus('pending');
        }
      } else {
        setIdStatus('not_submitted');
      }
    } catch (err: any) {
      console.error('Error fetching ID status:', err);
      setError(err.message || 'Failed to fetch ID status');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Use useEffect with proper dependency handling
  useEffect(() => {
    if (userId) {
      fetchIdStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // fetchIdStatus is intentionally omitted to prevent infinite loops

  const handleUploadSuccess = () => {
    setUploadSuccess(true);
    setShowUploadForm(false);
    setSuccessMessage('Your government ID has been uploaded successfully. It will be reviewed shortly.');
    setIdStatus('pending');
    
    // Fetch the updated status instead of refreshing the entire page
    setTimeout(() => {
      fetchIdStatus();
    }, 2000);
  };

  const getStatusDisplay = () => {
    switch (idStatus) {
      case 'verified':
        return {
          color: 'bg-green-50 border-green-200',
          textColor: 'text-green-800',
          icon: <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />,
          title: 'Government ID Verified',
          description: 'Your government ID has been verified. You can book properties without additional verification.'
        };
      case 'pending':
        return {
          color: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-800',
          icon: <ClockIcon className="h-8 w-8 text-yellow-500 mr-3" />,
          title: 'ID Verification Pending',
          description: 'Your government ID has been submitted and is pending verification by our team.'
        };
      case 'rejected':
        return {
          color: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          icon: <ExclamationCircleIcon className="h-8 w-8 text-red-500 mr-3" />,
          title: 'ID Verification Rejected',
          description: 'Your government ID verification was rejected. Please submit a new ID for verification.'
        };
      default:
        return {
          color: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800',
          icon: <IdentificationIcon className="h-8 w-8 text-blue-500 mr-3" />,
          title: 'Government ID Not Submitted',
          description: 'To ensure a smooth booking experience, we recommend verifying your government ID.'
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  if (isLoading) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 mb-6 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="h-8 w-8 bg-gray-300 rounded-full mr-3"></div>
          <div className="h-6 w-48 bg-gray-300 rounded"></div>
        </div>
        <div className="h-4 w-full bg-gray-300 rounded mb-4"></div>
        <div className="h-10 w-36 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <ExclamationCircleIcon className="h-8 w-8 text-red-500 mr-3" />
          <h3 className="text-lg font-medium text-red-800">Error Loading ID Status</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`border ${statusDisplay.color} rounded-lg p-6 mb-6`}>
      <div className="flex items-center mb-4">
        {statusDisplay.icon}
        <h3 className={`text-lg font-medium ${statusDisplay.textColor}`}>{statusDisplay.title}</h3>
      </div>
      
      <p className={`${statusDisplay.textColor} mb-4`}>{statusDisplay.description}</p>
      
      {/* Upload success message */}
      {uploadSuccess && successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Show upload button for not_submitted or rejected status */}
      {(idStatus === 'not_submitted' || idStatus === 'rejected') && !showUploadForm && (
        <button
          onClick={() => setShowUploadForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Upload Government ID
        </button>
      )}
      
      {/* Upload form */}
      {showUploadForm && (
        <div className="mt-4">
          <GovernmentIdUploadForm 
            userId={userId} 
            onSuccess={handleUploadSuccess} 
          />
          <button
            onClick={() => setShowUploadForm(false)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

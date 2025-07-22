'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { uploadGuestGovernmentId } from '@/app/users/actions';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ArrowUpTrayIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

// Define the form data type directly without Zod schema
type GovernmentIdFormData = {
  type: string;
  number?: string | null;
};

interface GuestGovernmentIdUploadFormProps {
  bookingId: string;
  guestEmail: string;
  guestPhone: string;
  onSuccess: () => void;
}

export default function GuestGovernmentIdUploadForm({ 
  bookingId, 
  guestEmail, 
  guestPhone,
  onSuccess 
}: GuestGovernmentIdUploadFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<GovernmentIdFormData>({
    defaultValues: {
      type: 'aadhar',
      number: '',
    }
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError(null);
    
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, JPEG, or PNG)');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const onSubmit = async (data: GovernmentIdFormData) => {
    if (!selectedFile) {
      setError('Please upload an image of your government ID');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create FormData object for the file upload
      const formData = new FormData();
      formData.append('type', data.type);
      
      // Handle the number field properly - empty string should be null
      if (data.number && data.number.trim() !== '') {
        formData.append('number', data.number);
      } else {
        // Explicitly append null or empty string to ensure the field is included
        formData.append('number', '');
      }
      
      // Validate file before uploading
      if (!selectedFile || selectedFile.size === 0) {
        setError('Please upload a valid ID image');
        setIsLoading(false);
        return;
      }
      
      formData.append('image', selectedFile);
      
      // Add booking ID and guest email to the form data
      formData.append('bookingId', bookingId);
      formData.append('guestEmail', guestEmail);
      
      // Call the server action with error handling
      const result = await uploadGuestGovernmentId(formData);
      console.log('Upload result:', result);

      if (!result || !result.success) {
        const errorMsg = result?.message || 'Failed to upload government ID';
        console.error('Upload error:', errorMsg);
        throw new Error(errorMsg);
      }

      // Call the onSuccess callback to notify parent component
      onSuccess();
    } catch (err: any) {
      console.error('Error uploading government ID:', err);
      setError(err.message || 'Failed to upload government ID');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Government ID Verification Required
      </h3>
      
      <p className="text-gray-600 mb-4">
        For security and verification purposes, please upload a government-issued ID. 
        This helps us verify your identity and ensure a safe experience for all users.
        Your ID will only be visible to the host of this property.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* ID Type Selection */}
        <div>
          <label htmlFor="id-type" className="block text-sm font-medium text-gray-700 mb-1">
            ID Type
          </label>
          <select
            id="id-type"
            {...register('type')}
            className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="aadhar">Aadhar Card</option>
            <option value="pan_card">PAN Card</option>
            <option value="passport">Passport</option>
            <option value="driver_license">Driver's License</option>
            <option value="other">Other Government ID</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        {/* ID Number (Optional) */}
        <div>
          <label htmlFor="id-number" className="block text-sm font-medium text-gray-700 mb-1">
            ID Number (Optional)
          </label>
          <input
            type="text"
            id="id-number"
            {...register('number')}
            className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter your ID number"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload ID Image
          </label>
          
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {previewUrl ? (
                <div className="mb-3">
                  <img 
                    src={previewUrl} 
                    alt="ID Preview" 
                    className="mx-auto h-32 object-contain"
                  />
                </div>
              ) : (
                <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
              )}
              
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, JPEG up to 5MB
              </p>
              {selectedFile && (
                <p className="text-xs text-green-600">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
          
          {error && (
            <div className="mt-2 flex items-center text-sm text-red-600">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-1" />
              {error}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                Upload ID
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

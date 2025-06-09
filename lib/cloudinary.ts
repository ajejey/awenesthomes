import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload an image to Cloudinary
 * @param file Base64 encoded image data
 * @param folder Folder to upload to
 * @returns Object containing the secure URL and public ID
 */
export async function uploadImage(file: string, folder = 'awenesthomes/properties') {
  try {
    // Log file info (first 50 chars only for privacy)
    console.log('Cloudinary upload - file type:', typeof file);
    console.log('Cloudinary upload - file length:', file ? file.length : 'N/A');
    console.log('Cloudinary upload - file starts with:', file ? file.substring(0, 50) + '...' : 'N/A');
    console.log('Cloudinary upload - folder:', folder);
    
    // Check if file is a valid base64 string
    if (!file || typeof file !== 'string') {
      throw new Error(`Invalid file data: expected string, got ${typeof file}`);
    }
    
    // Upload the image
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 1200, crop: 'limit' }, // Resize to max width of 1200px
        { quality: 'auto:good' }, // Optimize quality
      ],
    });

    console.log('Cloudinary upload successful:', { 
      url: result.secure_url,
      publicId: result.public_id 
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      success: true,
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return {
      url: '',
      publicId: '',
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    };
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId Public ID of the image to delete
 * @returns Success status
 */
export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return { success: false, error: 'Failed to delete image' };
  }
}

/**
 * Generate a signed upload URL for client-side uploads
 * @returns Object containing the signature and other params needed for upload
 */
export function generateSignature(folder = 'awenesthomes/properties') {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    },
    process.env.CLOUDINARY_API_SECRET as string
  );

  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
  };
}

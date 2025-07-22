'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models/user';
import Booking from '@/lib/models/booking';
import { requireAuth } from '@/app/auth';
import { uploadImage } from '@/lib/cloudinary';
import mongoose from 'mongoose';

// Schema for government ID upload
const governmentIdSchema = z.object({
  type: z.enum(['aadhar', 'pan_card', 'passport', 'driver_license', 'other'], {
    required_error: 'ID type is required',
  }),
  number: z.string().optional().nullable(),
  image: z.instanceof(File, {
    message: 'Please upload a valid image file',
  }),
});

// Upload government ID for authenticated users
export async function uploadGovernmentId(formData: FormData) {
  try {
    // Authenticate user
    const user = await requireAuth();
    console.log("user in uploadGovernmentId", user);
    if (!user) {
      return { success: false, message: 'Authentication required' };
    }

    // Connect to database
    await dbConnect();

    // Validate form data
    const type = formData.get('type') as string;
    const numberValue = formData.get('number');
    const number = numberValue && numberValue !== '' ? numberValue as string : null;
    const image = formData.get('image') as File;
    
    if (!image || image.size === 0) {
      return { success: false, message: 'Please upload a valid ID image' };
    }

    const validatedData = governmentIdSchema.parse({
      type,
      number,
      image,
    });

    console.log("validatedData in uploadGovernmentId", validatedData);

    // Upload image to Cloudinary
    // Convert File to base64 string for uploadImage
    const fileBuffer = await image.arrayBuffer();
    const base64String = Buffer.from(fileBuffer).toString('base64');
    const base64DataURI = `data:${image.type};base64,${base64String}`;
    
    // Upload the base64 image to Cloudinary
    const imageUploadResult = await uploadImage(base64DataURI, 'awenesthomes/government_ids');
    if (!imageUploadResult.success) {
      return { success: false, message: 'Failed to upload ID image' };
    }

    console.log("imageUploadResult in uploadGovernmentId", imageUploadResult);

    // Update user with government ID information
    const updatedUser = await User.findByIdAndUpdate(
      user.id, // Use id instead of _id for UserJwtPayload
      {
        governmentId: {
          type: validatedData.type,
          number: validatedData.number,
          imageUrl: imageUploadResult.url,
          isVerified: false,
          uploadedAt: new Date(),
        },
      },
      { new: true }
    );

    console.log("updatedUser in uploadGovernmentId", updatedUser);

    if (!updatedUser) {
      return { success: false, message: 'Failed to update user profile' };
    }

    // Revalidate user profile and bookings pages
    revalidatePath('/profile');
    revalidatePath('/bookings');

    return {
      success: true,
      message: 'Government ID uploaded successfully',
      governmentId: JSON.parse(JSON.stringify(updatedUser.governmentId)),
    };
  } catch (error) {
    console.error('Error uploading government ID:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation error',
        errors: error.errors,
      };
    }
    return { success: false, message: 'Failed to upload government ID' };
  }
}

// Check if user has a verified government ID
export async function checkGovernmentIdStatus(userId?: string) {
  try {
    // If no userId provided, get the current authenticated user
    let userIdToCheck = userId;
    
    if (!userIdToCheck) {
      const currentUser = await requireAuth();
      if (!currentUser) {
        return { success: false, message: 'Authentication required' };
      }
      userIdToCheck = currentUser.id.toString();
    }

    // Connect to database
    await dbConnect();

    // Find user and check government ID status
    const user = await User.findById(userIdToCheck).select('governmentId');
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Parse the user document to avoid circular references
    const parsedUser = JSON.parse(JSON.stringify(user));

    // Return government ID status
    return {
      success: true,
      hasGovernmentId: !!parsedUser.governmentId,
      isVerified: parsedUser.governmentId?.isVerified || false,
      governmentId: parsedUser.governmentId || null,
    };
  } catch (error) {
    console.error('Error checking government ID status:', error);
    return { success: false, message: 'Failed to check government ID status' };
  }
}

// Upload government ID for guests (no authentication required)
export async function uploadGuestGovernmentId(formData: FormData) {
  console.log("formData in uploadGuestGovernmentId", formData);
  try {
    // Connect to database
    await dbConnect();

    // Validate form data
    const type = formData.get('type') as string;
    const numberValue = formData.get('number');
    const number = numberValue && numberValue !== '' ? numberValue as string : null;
    const image = formData.get('image') as File;
    const bookingId = formData.get('bookingId') as string;
    const guestEmail = formData.get('guestEmail') as string;

    console.log("type in uploadGuestGovernmentId", type);
    console.log("number in uploadGuestGovernmentId", number);
    console.log("image in uploadGuestGovernmentId", image);
    console.log("bookingId in uploadGuestGovernmentId", bookingId);
    console.log("guestEmail in uploadGuestGovernmentId", guestEmail);
    
    if (!image || image.size === 0) {
      return { success: false, message: 'Please upload a valid ID image' };
    }

    if (!bookingId) {
      return { success: false, message: 'Booking ID is required' };
    }

    if (!guestEmail) {
      return { success: false, message: 'Guest email is required' };
    }

    const validatedData = governmentIdSchema.parse({
      type,
      number,
      image,
    });

    console.log("validatedData in uploadGuestGovernmentId", validatedData);

    // Upload image to Cloudinary
    const fileBuffer = await image.arrayBuffer();
    const base64String = Buffer.from(fileBuffer).toString('base64');
    const base64DataURI = `data:${image.type};base64,${base64String}`;
    
    // Upload the base64 image to Cloudinary
    const imageUploadResult = await uploadImage(base64DataURI, 'awenesthomes/government_ids');
    if (!imageUploadResult.success) {
      return { success: false, message: 'Failed to upload ID image' };
    }

    console.log("imageUploadResult in uploadGuestGovernmentId", imageUploadResult);

    // Find the booking
    const booking = await Booking.findById(bookingId);
    console.log("booking in uploadGuestGovernmentId", booking);
    if (!booking) {
      return { success: false, message: 'Booking not found' };
    }

    // Store the government ID information with the booking
    booking.guestGovernmentId = {
      type: validatedData.type,
      number: validatedData.number,
      imageUrl: imageUploadResult.url,
      isVerified: false,
      uploadedAt: new Date(),
      guestEmail: guestEmail
    };

    console.log("booking.guestGovernmentId in uploadGuestGovernmentId", booking.guestGovernmentId);

    await booking.save();

    console.log("booking after save in uploadGuestGovernmentId", booking);

    // Revalidate bookings pages
    revalidatePath(`/bookings/${bookingId}/confirmation`);
    console.log("revalidated bookings page");
    revalidatePath(`/host/bookings/${bookingId}`);
    console.log("revalidated host bookings page");

    return {
      success: true,
      message: 'Government ID uploaded successfully',
      governmentId: JSON.parse(JSON.stringify(booking.guestGovernmentId)),
    };
  } catch (error) {
    console.error('Error uploading guest government ID:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation error',
        errors: error.errors,
      };
    }
    return { success: false, message: 'Failed to upload government ID' };
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  try {
    // Connect to database
    await dbConnect();
    
    // Find user
    const user = await User.findById(userId).lean();
    
    if (!user) {
      return null;
    }
    
    // Convert MongoDB document to plain object and return
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

// Verify a guest's government ID (for hosts)
export async function verifyGuestGovernmentId({ userId, bookingId, isApproved }: { userId?: string; bookingId: string; isApproved: boolean }) {
  console.log("userId in verifyGuestGovernmentId", userId);
  console.log("bookingId in verifyGuestGovernmentId", bookingId);
  console.log("isApproved in verifyGuestGovernmentId", isApproved);
  try {
    // Authenticate host
    const host = await requireAuth();
    if (!host) {
      return { success: false, message: 'Authentication required' };
    }

    // Ensure the user is a host
    if (host.role !== 'host' && host.role !== 'admin') {
      return { success: false, message: 'Only hosts can verify government IDs' };
    }

    // Connect to database
    await dbConnect();

    // Get the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return { success: false, message: 'Booking not found' };
    }
    console.log("booking in verifyGuestGovernmentId", booking);

    let updatedUser = null;
    let isGuestBooking = false;

    // Check if this is a registered user or guest booking
    if (userId) {
      // This is a registered user booking
      updatedUser = await User.findById(userId);
      if (!updatedUser) {
        // If user not found, check if there's a government ID on the booking
        if (booking.guestGovernmentId) {
          isGuestBooking = true;
        } else {
          return { success: false, message: 'User not found and no government ID attached to booking' };
        }
      } else if (!updatedUser.governmentId) {
        // If user found but no government ID, check if there's one on the booking
        if (booking.guestGovernmentId) {
          isGuestBooking = true;
        } else {
          return { success: false, message: 'No government ID found for this user or booking' };
        }
      }
      // If we get here with userId and !isGuestBooking, it means we have a valid user with a government ID
    } else if (booking.guestGovernmentId) {
      // This is a guest booking with government ID attached to the booking
      isGuestBooking = true;
    } else {
      return { success: false, message: 'No government ID found for verification' };
    }

    if (isApproved) {
      if (isGuestBooking && booking.guestGovernmentId) {
        // Update the government ID verification status on the booking
        booking.guestGovernmentId.isVerified = true;
        booking.guestGovernmentId.verifiedAt = new Date();
        booking.guestGovernmentId.verifiedBy = new mongoose.Types.ObjectId(host.id);
      } else if (updatedUser && updatedUser.governmentId) {
        // Update the government ID verification status on the user
        updatedUser.governmentId.isVerified = true;
        updatedUser.governmentId.verifiedAt = new Date();
        updatedUser.governmentId.verifiedBy = new mongoose.Types.ObjectId(host.id);
        await updatedUser.save();
      }
      
      // Update booking status from pending_id_verification to pending
      if (booking.status === 'pending_id_verification') {
        booking.status = 'pending';
      }
      
      await booking.save();
      
      // Revalidate booking pages
      revalidatePath(`/bookings/${bookingId}/confirmation`);
      revalidatePath('/host/bookings');
      revalidatePath(`/host/bookings/${bookingId}`);

      return {
        success: true,
        message: 'Government ID verified successfully',
      };
    } else {
      // Reject the government ID
      if (isGuestBooking && booking.guestGovernmentId) {
        // Update the government ID verification status on the booking
        booking.guestGovernmentId.isVerified = false;
        await booking.save();
      } else if (updatedUser && updatedUser.governmentId) {
        // Update the government ID verification status on the user
        updatedUser.governmentId.isVerified = false;
        await updatedUser.save();
      }

      // Revalidate pages
      revalidatePath(`/bookings/${bookingId}/confirmation`);
      revalidatePath('/host/bookings');
      revalidatePath(`/host/bookings/${bookingId}`);

      return {
        success: true,
        message: 'Government ID verification rejected',
      };
    }
  } catch (error) {
    console.error('Error verifying government ID:', error);
    return { success: false, message: 'Failed to verify government ID' };
  }
}

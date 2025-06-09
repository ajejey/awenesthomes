'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { differenceInDays, parseISO } from 'date-fns';

import { requireAuth, getCurrentUser } from '../auth';
import dbConnect from '@/lib/db';
import Booking from '@/lib/models/booking';
import Property from '@/lib/models/property';
import { User } from '@/lib/models/user';
import { BookingStatusSchema, PaymentStatusSchema } from '@/lib/schemas/booking';
import { GuestBookingFormSchema } from '@/lib/schemas/guestBooking';

// Import OTP and email functions
import { sendOTP } from '@/app/auth/login/actions';
import { sendBookingConfirmationEmail } from '@/lib/email';

// Schema for booking creation
const createBookingSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.coerce.number().min(1, 'At least 1 guest is required'),
  specialRequests: z.string().optional(),
});

// Type for booking creation
type CreateBookingInput = z.infer<typeof createBookingSchema>;

/**
 * Create a new booking
 */
export async function createBooking(formData: FormData) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the current user if logged in (will be null for guest bookings)
    const user = await getCurrentUser();
    console.log('User while creating booking:', user);

    // Extract form data
    const propertyId = formData.get('propertyId')?.toString();
    const checkIn = formData.get('checkIn')?.toString();
    const checkOut = formData.get('checkOut')?.toString();
    const guestsStr = formData.get('guests')?.toString();
    const specialRequests = formData.get('specialRequests')?.toString();

    // Guest booking specific fields
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const phone = formData.get('phone')?.toString();
    const createAccountStr = formData.get('createAccount')?.toString();
    const createAccount = createAccountStr === 'true';

    // Validate required fields
    if (!propertyId || !checkIn || !checkOut || !guestsStr) {
      return { success: false, message: 'Missing required booking fields' };
    }

    // For guest bookings, validate guest information
    if (!user && (!name || !email)) {
      return { success: false, message: 'Guest information is required' };
    }

    const guests = parseInt(guestsStr, 10);

    // Fetch the property
    const property = await Property.findById(propertyId);
    if (!property) {
      return { success: false, message: 'Property not found' };
    }

    // Check if property is available for the selected dates
    // This would be implemented in a real application
    // For now, we'll assume it's available
    const isAvailable = true;

    // Parse dates for calculations
    const checkInDate = parseISO(checkIn);
    const checkOutDate = parseISO(checkOut);
    
    // Calculate total nights
    const totalNights = differenceInDays(checkOutDate, checkInDate);
    if (totalNights < 1) {
      return { success: false, message: 'Check-out date must be after check-in date' };
    }

    // Calculate pricing (simplified for this implementation)
    // Assume property has pricing structure with base price per night
    const basePrice = property.pricing?.basePrice * totalNights || 100 * totalNights;
    const cleaningFee = property.pricing?.cleaningFee || 20;
    const serviceFee = Math.round(basePrice * 0.12); // 12% service fee
    const taxRate = 0.18; // 18% tax
    const taxAmount = Math.round(basePrice * taxRate);
    const totalAmount = basePrice + cleaningFee + serviceFee + taxAmount;
    
    // Currency for the booking (using INR as default since it's not in the IPricing interface)
    const currency = 'INR'; // Default currency for all bookings

    // Handle guest user - either find existing user by email or create a new one
    let guestId;
    if (user) {
      // Use the authenticated user's ID
      // Type assertion for UserJwtPayload which may not have _id directly
      console.log('User ID while creating booking:', user.id);
      guestId = user.id;
    } else if (email) {
      console.log('Email while creating booking:', email);
      // Check if a user with this email already exists
      let guestUser = await User.findOne({ email });
      
      if (!guestUser) {
        console.log('Guest user not found, creating new guest user');
        // Create a new guest user
        guestUser = await User.create({
          email,
          name: name || 'Guest',
          phone,
          role: 'guest',
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        // If user opted to create an account, send OTP for verification
        if (createAccount) {
          console.log('User opted to create an account, sending OTP for verification');
          // Use the existing sendOTP function from auth actions
          const otpResult = await sendOTP(email);
          console.log('OTP result:', otpResult);
          if (!otpResult.success) {
            console.error('Failed to send OTP:', otpResult.error);
          }
        }
      }
      
      guestId = guestUser._id;
    } else {
      return { success: false, message: 'Guest email is required' };
    }

    // Create the booking
    const newBooking = await Booking.create({
      propertyId,
      guestId,
      hostId: property.hostId,
      checkIn,
      checkOut,
      guests,
      totalNights,
      // Add pricing fields directly to the booking document as required by the schema
      basePrice,
      cleaningFee,
      serviceFee,
      taxRate,
      taxAmount,
      totalAmount,
      discountAmount: 0,
      discountType: 'none',
      status: BookingStatusSchema.enum.pending,
      paymentStatus: PaymentStatusSchema.enum.pending,
      specialRequests,
      // Store guest information directly in the booking for convenience
      guestName: name || (user ? user.name : ''),
      guestEmail: email || (user ? user.email : ''),
      guestPhone: phone || (user ? (user as any).phone : ''), // Type assertion for phone property
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Revalidate the bookings page
    revalidatePath('/bookings');

    // Send booking confirmation email
    try {
      // Prepare booking details for email
      const bookingDetails = {
        id: (newBooking._id as unknown as { toString(): string }).toString(),
        property: {
          name: property.title,
          address: property.location?.address || '',
          image: (property.images as any[])?.find((img: any) => img.isPrimary)?.url || 
                 (property.images as any[])[0]?.url || ''
        },
        checkIn,
        checkOut,
        guests,
        totalAmount,
        status: newBooking.status
      };

      // Send email to guest
      await sendBookingConfirmationEmail(email || user?.email || '', bookingDetails);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the booking creation if email fails
    }

    // Return success with booking ID and account creation status
    return { 
      success: true, 
      bookingId: (newBooking._id as unknown as { toString(): string }).toString(), // Type assertion for MongoDB ObjectId
      accountCreated: !user && createAccount,
      message: !user && createAccount ? 
        'Your booking has been created and a verification email has been sent to your email address.' : 
        'Your booking has been created successfully.'
    };
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return { success: false, message: error.message || 'Failed to create booking' };
  }
}

/**
 * Check if a property is available for the selected dates
 */
export async function checkPropertyAvailability(
  propertyId: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  try {
    await dbConnect();

    const property = await Property.findById(propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    const checkInDate = parseISO(checkIn);
    const checkOutDate = parseISO(checkOut);

    // Check if the dates are within any availability range
    const isWithinAvailabilityRange = property.availability.some(range => {
      const rangeStart = new Date(range.startDate);
      const rangeEnd = new Date(range.endDate);
      
      return (
        (checkInDate >= rangeStart && checkInDate <= rangeEnd) &&
        (checkOutDate >= rangeStart && checkOutDate <= rangeEnd)
      );
    });

    if (!isWithinAvailabilityRange) {
      return false;
    }

    // Check if the dates overlap with any blocked dates
    const overlapsWithBlockedDates = property.blockedDates.some(block => {
      const blockStart = new Date(block.startDate);
      const blockEnd = new Date(block.endDate);
      
      // Check if there's any overlap
      return (
        (checkInDate <= blockEnd && checkOutDate >= blockStart)
      );
    });

    if (overlapsWithBlockedDates) {
      return false;
    }

    // Check if there are any existing bookings for these dates
    const existingBookings = await Booking.find({
      propertyId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        // Check-in date falls within an existing booking
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkInDate }
        }
      ]
    });

    return existingBookings.length === 0;
  } catch (error) {
    console.error('Error checking property availability:', error);
    return false;
  }
}

/**
 * Get booking details by ID
 */
export async function getBookingById(bookingId: string) {
  try {
    await dbConnect();
    
    const booking = await Booking.findById(bookingId)
      .populate('propertyId', 'title images location')
      .populate('hostId', 'name email profileImage')
      .populate('guestId', 'name email profileImage');
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    return JSON.parse(JSON.stringify(booking));
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    throw new Error(error.message || 'Failed to fetch booking');
  }
}

/**
 * Get all bookings for a user (as guest)
 */
export async function getUserBookings() {
  return getBookingsByUser();
}

export async function getBookingsByUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to view your bookings');
  }

  try {
    await dbConnect();
    
    const bookings = await Booking.find({ guestId: user.id })
      .populate('propertyId', 'title images location')
      .populate('hostId', 'name email profileImage')
      .sort({ createdAt: -1 });
    
    return JSON.parse(JSON.stringify(bookings));
  } catch (error: any) {
    console.error('Error fetching user bookings:', error);
    throw new Error(error.message || 'Failed to fetch bookings');
  }
}

/**
 * Get all bookings for a host
 */
export async function getHostBookings() {
  return getBookingsByHost();
}

export async function getBookingsByHost() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to view your bookings');
  }

  if (user.role !== 'host' && user.role !== 'admin') {
    throw new Error('Only hosts can view property bookings');
  }

  try {
    await dbConnect();
    
    const bookings = await Booking.find({ hostId: user.id })
      .populate('propertyId', 'title images location')
      .populate('guestId', 'name email profileImage')
      .sort({ createdAt: -1 });
    
    return JSON.parse(JSON.stringify(bookings));
  } catch (error: any) {
    console.error('Error fetching host bookings:', error);
    throw new Error(error.message || 'Failed to fetch bookings');
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  status: 'confirmed' | 'rejected' | 'cancelled_by_host' | 'cancelled_by_guest',
  reason?: string
) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to update a booking');
  }

  try {
    await dbConnect();
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Check permissions based on the action
    if (['confirmed', 'rejected', 'cancelled_by_host'].includes(status)) {
      // Only the host can confirm, reject, or cancel as host
      if (booking.hostId.toString() !== user.id && user.role !== 'admin') {
        throw new Error('You do not have permission to update this booking');
      }
    } else if (status === 'cancelled_by_guest') {
      // Only the guest can cancel as guest
      if (booking.guestId.toString() !== user.id && user.role !== 'admin') {
        throw new Error('You do not have permission to cancel this booking');
      }
    }
    
    // Update booking status
    booking.status = status;
    
    // Add cancellation details if applicable
    if (['cancelled_by_host', 'cancelled_by_guest', 'rejected'].includes(status)) {
      booking.cancellationReason = reason || '';
      booking.cancellationDate = new Date();
    }
    
    await booking.save();
    
    // If booking is confirmed or cancelled, update property availability
    if (status === 'confirmed') {
      const property = await Property.findById(booking.propertyId);
      if (property) {
        // Add the booked dates to blockedDates
        property.blockedDates.push({
          startDate: booking.checkIn,
          endDate: booking.checkOut,
          reason: `Booked by ${user.name || user.email}`,
        });
        
        await property.save();
      }
    } else if (['cancelled_by_host', 'cancelled_by_guest', 'rejected'].includes(status)) {
      const property = await Property.findById(booking.propertyId);
      if (property) {
        // Remove the booked dates from blockedDates
        property.blockedDates = property.blockedDates.filter(
          block => 
            block.startDate.getTime() !== booking.checkIn.getTime() || 
            block.endDate.getTime() !== booking.checkOut.getTime()
        );
        
        await property.save();
      }
    }
    
    revalidatePath('/bookings');
    revalidatePath(`/bookings/${bookingId}`);
    
    return JSON.parse(JSON.stringify(booking));
  } catch (error: any) {
    console.error('Error updating booking status:', error);
    throw new Error(error.message || 'Failed to update booking status');
  }
}

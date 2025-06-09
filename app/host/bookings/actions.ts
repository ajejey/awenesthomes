'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser } from '@/app/auth';
import dbConnect from '@/lib/db';
import Booking from '@/lib/models/booking';
import { BookingSchema } from '@/lib/schemas/booking';
import Property from '@/lib/models/property';
import { User } from '@/lib/models/user';
import { BookingFilterSchema, BookingUpdateSchema } from '@/lib/schemas/booking';

/**
 * Get all bookings for the current host with filtering options
 */
export async function getHostBookings(filters = {}) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    if (user.role !== 'host' && user.role !== 'admin') {
      throw new Error('Only hosts and admins can access bookings');
    }
    
    // Parse and validate filters
    const validatedFilters = BookingFilterSchema.parse(filters);
    
    // Connect to database
    await dbConnect();
    
    // Build query
    const query: any = { hostId: user.id };
    
    // Apply status filter
    if (validatedFilters.status && validatedFilters.status !== 'all') {
      if (validatedFilters.status === 'cancelled') {
        // Include both guest and host cancellations
        query.status = { $in: ['cancelled_by_guest', 'cancelled_by_host'] };
      } else {
        query.status = validatedFilters.status;
      }
    }
    
    // Apply timeframe filter
    if (validatedFilters.timeframe) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (validatedFilters.timeframe === 'upcoming') {
        query.checkOut = { $gte: today };
      } else if (validatedFilters.timeframe === 'past') {
        query.checkOut = { $lt: today };
      }
    }
    
    // Apply search filter if provided
    if (validatedFilters.search) {
      // First find properties that match the search term
      const properties = await Property.find({
        hostId: user.id,
        $or: [
          { title: { $regex: validatedFilters.search, $options: 'i' } },
          { 'location.address': { $regex: validatedFilters.search, $options: 'i' } },
          { 'location.city': { $regex: validatedFilters.search, $options: 'i' } }
        ]
      }).select('_id');
      
      // Then find guests that match the search term
      const guests = await User.find({
        $or: [
          { name: { $regex: validatedFilters.search, $options: 'i' } },
          { email: { $regex: validatedFilters.search, $options: 'i' } }
        ]
      }).select('_id');
      
      // Add these to our query
      query.$or = [
        { propertyId: { $in: properties.map(p => p._id) } },
        { guestId: { $in: guests.map(g => g._id) } }
      ];
    }
    
    // Determine sort order
    let sortOptions: any = {};
    switch (validatedFilters.sortBy) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'check_in':
        sortOptions = { checkIn: 1 };
        break;
      case 'check_out':
        sortOptions = { checkOut: 1 };
        break;
      case 'amount':
        sortOptions = { totalAmount: -1 };
        break;
      default:
        sortOptions = { checkIn: 1 };
    }
    
    // Execute query with pagination
    const bookings = await Booking.find(query)
      .sort(sortOptions)
      .populate('propertyId', 'title images')
      .populate('guestId', 'name email')
      .lean();

      console.log(" bookings ", bookings);
    
    // Get total count
    const totalCount = await Booking.countDocuments(query);
    
    // Process bookings to include property and guest information
    const processedBookings = bookings.map((booking: any) => {
      // Extract primary image from property
      const primaryImage = booking.propertyId?.images?.find((img: any) => img.isPrimary)?.url || 
                          (booking.propertyId?.images?.[0]?.url || '');
      console.log(" booking ", {
        _id: booking?._id?.toString(),
        propertyId: booking?.propertyId?._id?.toString(),
        guestId: booking?.guestId?._id?.toString(),
        hostId: booking?.hostId?.toString(),
        propertyTitle: booking?.propertyId?.title,
        propertyImage: primaryImage,
        guestName: booking?.guestId?.name,
        guestEmail: booking?.guestId?.email,
        checkIn: booking?.checkIn?.toISOString(),
        checkOut: booking?.checkOut?.toISOString(),
        createdAt: booking?.createdAt?.toISOString(),
        updatedAt: booking?.updatedAt?.toISOString(),
        cancellationDate: booking?.cancellationDate ? booking?.cancellationDate?.toISOString() : undefined,
      });
      return {
        ...booking,
        _id: booking._id.toString(),
        propertyId: booking.propertyId._id.toString(),
        guestId: booking.guestId._id.toString(),
        hostId: booking.hostId.toString(),
        propertyTitle: booking.propertyId.title,
        propertyImage: primaryImage,
        guestName: booking.guestId.name,
        guestEmail: booking.guestId.email,
        checkIn: booking.checkIn.toISOString(),
        checkOut: booking.checkOut.toISOString(),
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
        cancellationDate: booking.cancellationDate ? booking.cancellationDate.toISOString() : undefined,
      };
    });
    
    return { 
      bookings: processedBookings, 
      totalCount 
    };
  } catch (error) {
    console.error('Error fetching host bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
}

/**
 * Get a single booking by ID
 */
export async function getBookingById(bookingId: string) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    await dbConnect();
    
    const booking: any = await Booking.findById(bookingId)
      .populate('propertyId', 'title description images location bedrooms beds bathrooms maxGuests amenities houseRules')
      .populate('guestId', 'name email')
      .lean();
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Check if the user is authorized to view this booking
    if (booking.hostId.toString() !== user.id && 
        booking.guestId._id.toString() !== user.id && 
        user.role !== 'admin') {
      throw new Error('Not authorized to view this booking');
    }
    
    // Extract primary image from property
    const primaryImage = booking.propertyId?.images?.find((img: any) => img.isPrimary)?.url || 
                        (booking.propertyId?.images?.[0]?.url || '');
    
    // Process booking to include property and guest information
    const processedBooking = {
      ...booking,
      _id: booking._id.toString(),
      propertyId: booking.propertyId._id.toString(),
      guestId: booking.guestId._id.toString(),
      hostId: booking.hostId.toString(),
      propertyTitle: booking.propertyId.title,
      propertyImage: primaryImage,
      propertyDescription: booking.propertyId.description,
      propertyLocation: booking.propertyId.location,
      propertyBedrooms: booking.propertyId.bedrooms,
      propertyBeds: booking.propertyId.beds,
      propertyBathrooms: booking.propertyId.bathrooms,
      propertyMaxGuests: booking.propertyId.maxGuests,
      propertyAmenities: booking.propertyId.amenities,
      propertyHouseRules: booking.propertyId.houseRules,
      guestName: booking.guestId.name,
      guestEmail: booking.guestId.email,
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      cancellationDate: booking.cancellationDate ? booking.cancellationDate.toISOString() : undefined,
    };
    
    return processedBooking;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw new Error('Failed to fetch booking details');
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(bookingId: string, data: z.infer<typeof BookingUpdateSchema>) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    // Validate update data
    const validatedData = BookingUpdateSchema.parse(data);
    
    await dbConnect();
    
    // Find the booking
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Check if the user is authorized to update this booking
    if (booking.hostId.toString() !== user.id && user.role !== 'admin') {
      throw new Error('Not authorized to update this booking');
    }
    
    // Prepare update data
    const updateData: any = {
      status: validatedData.status
    };
    
    // If status is cancelled by host, add cancellation details
    if (validatedData.status === 'cancelled_by_host') {
      updateData.cancellationReason = validatedData.cancellationReason || 'Cancelled by host';
      updateData.cancellationDate = new Date();
    }
    
    // Update the booking
    await Booking.findByIdAndUpdate(bookingId, updateData);
    
    // Revalidate paths
    revalidatePath('/host/bookings');
    revalidatePath(`/host/bookings/${bookingId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw new Error('Failed to update booking status');
  }
}

/**
 * Get booking statistics for the host dashboard
 */
export async function getBookingStats() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    if (user.role !== 'host' && user.role !== 'admin') {
      throw new Error('Only hosts and admins can access booking stats');
    }
    
    await dbConnect();
    
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get date 30 days ago
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Get upcoming bookings count
    const upcomingBookings = await Booking.countDocuments({
      hostId: user.id,
      status: { $in: ['pending', 'confirmed'] },
      checkIn: { $gte: today }
    });
    
    // Get current guests count (checked in but not checked out)
    const currentGuests = await Booking.countDocuments({
      hostId: user.id,
      status: 'confirmed',
      checkIn: { $lte: today },
      checkOut: { $gt: today }
    });
    
    // Get completed bookings in last 30 days
    const recentCompletedBookings = await Booking.countDocuments({
      hostId: user.id,
      status: 'completed',
      checkOut: { $gte: thirtyDaysAgo, $lte: today }
    });
    
    // Get total revenue in last 30 days
    const revenueResult = await Booking.aggregate([
      {
        $match: {
          hostId: user.id,
          status: { $in: ['confirmed', 'completed'] },
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    
    return {
      upcomingBookings,
      currentGuests,
      recentCompletedBookings,
      totalRevenue
    };
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    throw new Error('Failed to fetch booking statistics');
  }
}

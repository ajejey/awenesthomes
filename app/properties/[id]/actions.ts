'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser, UserJwtPayload } from '@/app/auth';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/property';
import { User, IUser } from '@/lib/models/user';
import { notFound } from 'next/navigation';

/**
 * Get a property by ID with all details
 */
export async function getProperty(propertyId: string) {
  try {
    // Connect to database
    await dbConnect();
    
    // Find property
    const property = await Property.findById(propertyId)
      .populate({
        path: 'hostId',
        select: 'name email profileImage bio phoneNumber joinedDate',
        model: User
      })
      .lean();
    
    if (!property) {
      notFound();
    }
    
    // Check if property is published
    if (property.status !== 'published') {
      // If not published, check if current user is the host or admin
      const user = await getCurrentUser();
      
      if (!user || (user.id !== property.hostId._id.toString() && user.role !== 'admin')) {
        notFound();
      }
    }
    
    // Format the property data
    const formattedProperty = {
      ...property,
      _id: property._id.toString(),
      host: {
        _id: property.hostId._id.toString(),
        name: (property.hostId as any).name,
        email: (property.hostId as any).email,
        image: (property.hostId as any).profileImage,
        bio: (property.hostId as any).bio || '',
        phoneNumber: (property.hostId as any).phone || '',
        joinedDate: (property.hostId as any).createdAt,
      },
      createdAt: property.createdAt?.toISOString(),
      updatedAt: property.updatedAt?.toISOString(),
      availability: property.availability.map((range: any) => ({
        ...range,
        startDate: range.startDate?.toISOString(),
        endDate: range.endDate?.toISOString(),
      })),
      blockedDates: property.blockedDates?.map((range: any) => ({
        ...range,
        startDate: range.startDate?.toISOString(),
        endDate: range.endDate?.toISOString(),
      })) || [],
    };
    
    // Remove the hostId field since we've transformed it to host
    const finalProperty = { ...formattedProperty };
    delete (finalProperty as any).hostId;
    
    return JSON.parse(JSON.stringify(finalProperty));
  } catch (error) {
    console.error('Error fetching property:', error);
    throw new Error('Failed to fetch property');
  }
}

// Schema for booking date validation
const bookingDatesSchema = z.object({
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().min(1),
});

/**
 * Check availability for booking dates
 */
export async function checkAvailability(propertyId: string, data: any) {
  try {
    // Validate data
    const validatedData = bookingDatesSchema.parse(data);
    
    // Connect to database
    await dbConnect();
    
    // Find property
    const property = await Property.findById(propertyId).lean();
    
    if (!property) {
      throw new Error('Property not found');
    }
    
    // Check if property is published
    if (property.status !== 'published') {
      throw new Error('Property is not available for booking');
    }
    
    // Parse dates
    const checkIn = new Date(validatedData.checkIn);
    const checkOut = new Date(validatedData.checkOut);
    
    // Validate dates
    if (checkIn >= checkOut) {
      throw new Error('Check-out date must be after check-in date');
    }
    
    // Calculate number of nights
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    // Check minimum stay
    if (nights < property.pricing.minimumStay) {
      throw new Error(`Minimum stay is ${property.pricing.minimumStay} night${property.pricing.minimumStay > 1 ? 's' : ''}`);
    }
    
    // Check maximum stay if set
    if (property.pricing.maximumStay && nights > property.pricing.maximumStay) {
      throw new Error(`Maximum stay is ${property.pricing.maximumStay} nights`);
    }
    
    // Check if dates are within availability ranges
    const isWithinAvailability = property.availability.some((range: any) => {
      const rangeStart = new Date(range.startDate);
      const rangeEnd = new Date(range.endDate);
      return checkIn >= rangeStart && checkOut <= rangeEnd;
    });
    
    if (!isWithinAvailability) {
      throw new Error('Selected dates are not available');
    }
    
    // Check if dates overlap with blocked dates
    const isBlocked = property.blockedDates?.some((range: any) => {
      const rangeStart = new Date(range.startDate);
      const rangeEnd = new Date(range.endDate);
      
      // Check if there's any overlap
      return (
        (checkIn >= rangeStart && checkIn < rangeEnd) ||
        (checkOut > rangeStart && checkOut <= rangeEnd) ||
        (checkIn <= rangeStart && checkOut >= rangeEnd)
      );
    });
    
    if (isBlocked) {
      throw new Error('Selected dates include blocked dates');
    }
    
    // Check if guests count is valid
    if (validatedData.guests > property.maxGuests) {
      throw new Error(`Maximum ${property.maxGuests} guest${property.maxGuests > 1 ? 's' : ''} allowed`);
    }
    
    // Calculate pricing
    const baseTotal = property.pricing.basePrice * nights;
    const cleaningFee = property.pricing.cleaningFee || 0;
    const serviceFee = property.pricing.serviceFee || 0;
    const taxAmount = (baseTotal + cleaningFee + serviceFee) * (property.pricing.taxRate / 100);
    
    // Apply discounts if applicable
    let discountedTotal = baseTotal;
    let discountApplied = null;
    
    if (property.pricing.discounts) {
      if (nights >= 7 && property.pricing.discounts.weekly) {
        discountedTotal = baseTotal * (1 - property.pricing.discounts.weekly / 100);
        discountApplied = {
          type: 'weekly',
          percentage: property.pricing.discounts.weekly,
          amount: baseTotal - discountedTotal,
        };
      } else if (nights >= 28 && property.pricing.discounts.monthly) {
        discountedTotal = baseTotal * (1 - property.pricing.discounts.monthly / 100);
        discountApplied = {
          type: 'monthly',
          percentage: property.pricing.discounts.monthly,
          amount: baseTotal - discountedTotal,
        };
      }
    }
    
    // Calculate total
    const total = discountedTotal + cleaningFee + serviceFee + taxAmount;
    
    return {
      available: true,
      nights,
      pricing: {
        basePrice: property.pricing.basePrice,
        baseTotal,
        discountedTotal,
        discount: discountApplied,
        cleaningFee,
        serviceFee,
        taxRate: property.pricing.taxRate,
        taxAmount,
        total,
      },
    };
  } catch (error) {
    console.error('Error checking availability:', error);
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

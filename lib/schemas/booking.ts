import { z } from 'zod';

// Define booking status types as Zod enum
export const BookingStatusSchema = z.enum([
  'pending',
  'confirmed',
  'completed',
  'cancelled_by_guest',
  'cancelled_by_host',
  'rejected'
]);

// Define payment status types as Zod enum
export const PaymentStatusSchema = z.enum([
  'pending',
  'completed',
  'refunded',
  'partially_refunded',
  'failed'
]);

// Define discount type as Zod enum
export const DiscountTypeSchema = z.enum([
  'none',
  'weekly',
  'monthly',
  'special'
]);

// Define booking schema
export const BookingSchema = z.object({
  _id: z.string().optional(), // MongoDB ObjectId as string on client
  propertyId: z.string(), // MongoDB ObjectId as string on client
  guestId: z.string(), // MongoDB ObjectId as string on client
  hostId: z.string(), // MongoDB ObjectId as string on client
  
  // Property information at time of booking
  propertyTitle: z.string().optional(),
  propertyImage: z.string().optional(),
  
  // Guest information
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional(),
  
  // Dates
  checkIn: z.string().refine(date => !isNaN(new Date(date).getTime()), "Invalid check-in date"),
  checkOut: z.string().refine(date => !isNaN(new Date(date).getTime()), "Invalid check-out date"),
  
  // Booking details
  guests: z.number().int().min(1, "At least 1 guest is required"),
  totalNights: z.number().int().min(1, "Booking must be for at least 1 night"),
  
  // Financial details
  basePrice: z.number().min(0, "Base price cannot be negative"),
  cleaningFee: z.number().min(0, "Cleaning fee cannot be negative"),
  serviceFee: z.number().min(0, "Service fee cannot be negative"),
  taxAmount: z.number().min(0, "Tax amount cannot be negative"),
  taxRate: z.number().min(0, "Tax rate cannot be negative"),
  discountAmount: z.number().min(0, "Discount amount cannot be negative").default(0),
  discountType: DiscountTypeSchema.default('none'),
  totalAmount: z.number().min(0, "Total amount cannot be negative"),
  
  // Status
  status: BookingStatusSchema.default('pending'),
  paymentStatus: PaymentStatusSchema.default('pending'),
  paymentId: z.string().optional(),
  
  // Additional information
  specialRequests: z.string().max(500, "Special requests cannot exceed 500 characters").optional(),
  cancellationReason: z.string().max(500, "Cancellation reason cannot exceed 500 characters").optional(),
  cancellationDate: z.string().optional(), // Date as string on client
  refundAmount: z.number().min(0, "Refund amount cannot be negative").optional(),
  
  // Timestamps
  createdAt: z.string().optional(), // Date as string on client
  updatedAt: z.string().optional(), // Date as string on client
}).refine(data => new Date(data.checkOut) > new Date(data.checkIn), {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"],
});

// Export type for TypeScript
export type BookingFormData = z.infer<typeof BookingSchema>;

// Define booking filter schema
export const BookingFilterSchema = z.object({
  status: z.enum(['all', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected']).optional().default('all'),
  sortBy: z.enum(['newest', 'oldest', 'check_in', 'check_out', 'amount']).optional().default('check_in'),
  search: z.string().optional(),
  timeframe: z.enum(['upcoming', 'past', 'all']).optional().default('upcoming'),
});

export type BookingFilterParams = z.infer<typeof BookingFilterSchema>;

// Define booking update schema for status changes
export const BookingUpdateSchema = z.object({
  status: BookingStatusSchema,
  cancellationReason: z.string().max(500).optional(),
});

export type BookingUpdateData = z.infer<typeof BookingUpdateSchema>;

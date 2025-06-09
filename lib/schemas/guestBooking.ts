import { z } from 'zod';
import { BookingSchema, BookingStatusSchema, PaymentStatusSchema, DiscountTypeSchema } from './booking';

// Define guest information schema
export const GuestInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required").optional(),
});

// Define guest booking schema that extends the regular booking schema
export const GuestBookingSchema = z.object({
  // Guest information
  guestInfo: GuestInfoSchema,
  
  // Property information
  propertyId: z.string(),
  propertyTitle: z.string().optional(),
  propertyImage: z.string().optional(),
  
  // Booking details
  checkIn: z.string().refine(date => !isNaN(new Date(date).getTime()), "Invalid check-in date"),
  checkOut: z.string().refine(date => !isNaN(new Date(date).getTime()), "Invalid check-out date"),
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
  
  // Optional account creation
  createAccount: z.boolean().default(false),
}).refine(data => new Date(data.checkOut) > new Date(data.checkIn), {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"],
});

// Export type for TypeScript
export type GuestBookingFormData = z.infer<typeof GuestBookingSchema>;

// Define a schema for the form data that will be submitted
export const GuestBookingFormSchema = z.object({
  // Guest information
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required").optional(),
  
  // Booking details
  propertyId: z.string(),
  checkIn: z.string().refine(date => !isNaN(new Date(date).getTime()), "Invalid check-in date"),
  checkOut: z.string().refine(date => !isNaN(new Date(date).getTime()), "Invalid check-out date"),
  guests: z.number().int().min(1, "At least 1 guest is required"),
  
  // Additional information
  specialRequests: z.string().max(500, "Special requests cannot exceed 500 characters").optional(),
  
  // Optional account creation
  createAccount: z.boolean().default(false),
});

export type GuestBookingFormInput = z.infer<typeof GuestBookingFormSchema>;

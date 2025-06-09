import { z } from 'zod';

export const UserSchema = z.object({
  _id: z.string().optional(), // MongoDB ObjectId is a string on the client
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(['guest', 'host', 'admin']).default('guest'),
  emailVerified: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const LocationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const PropertySchema = z.object({
  _id: z.string().optional(),
  hostId: z.string(), // Will be ObjectId string
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: LocationSchema,
  pricePerNight: z.number().positive("Price must be positive"),
  guestCapacity: z.number().int().positive("Guest capacity must be a positive integer"),
  bedrooms: z.number().int().positive().optional(),
  beds: z.number().int().positive().optional(),
  bathrooms: z.number().positive().optional(),
  amenities: z.array(z.string()).optional(),
  photos: z.array(z.string().url("Invalid URL for photo")).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Property = z.infer<typeof PropertySchema>;

export const BookingSchema = z.object({
  _id: z.string().optional(),
  guestId: z.string(), // Will be ObjectId string
  propertyId: z.string(), // Will be ObjectId string
  checkInDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), "Invalid check-in date"),
  checkOutDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), "Invalid check-out date"),
  numberOfGuests: z.number().int().positive("Number of guests must be positive"),
  totalPrice: z.number().positive("Total price must be positive"),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).default('pending'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).refine(data => new Date(data.checkOutDate) > new Date(data.checkInDate), {
  message: "Check-out date must be after check-in date",
  path: ["checkOutDate"],
});

export type Booking = z.infer<typeof BookingSchema>;

export const ReviewSchema = z.object({
  _id: z.string().optional(),
  guestId: z.string(),
  propertyId: z.string(),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Review = z.infer<typeof ReviewSchema>;

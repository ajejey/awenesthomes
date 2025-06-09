export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: 'guest' | 'host' | 'admin';
}

export function isUser(obj: any): obj is User {
  return obj && typeof obj === 'object' && ('_id' in obj || 'id' in obj) && 'name' in obj;
}

export interface Property {
  _id: string;
  id: string;
  title: string;
  images: string[];
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  hostId: string | User;
}

export function isProperty(obj: any): obj is Property {
  return obj && typeof obj === 'object' && ('_id' in obj || 'id' in obj) && 'title' in obj;
}

export interface Booking {
  _id: string;
  id: string;
  propertyId: string | Property;
  guestId: string | User;
  hostId: string | User;
  checkIn: Date | string;
  checkOut: Date | string;
  guests: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled_by_guest' | 'cancelled_by_host' | 'rejected';
  totalAmount: number;
  basePrice: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  discountAmount: number;
  discountType: 'none' | 'weekly' | 'monthly';
  specialRequests?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod?: string;
  paymentId?: string;
  cancellationReason?: string;
  cancellationDate?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

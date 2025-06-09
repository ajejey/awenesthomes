import mongoose, { Schema, Document, Model } from 'mongoose';

// Define booking status types
export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'completed' 
  | 'cancelled_by_guest'
  | 'cancelled_by_host'
  | 'rejected';

// Define payment status types
export type PaymentStatus =
  | 'pending'
  | 'completed'
  | 'refunded'
  | 'partially_refunded'
  | 'failed';

// Define booking interface
export interface IBooking extends Document {
  propertyId: mongoose.Types.ObjectId;
  guestId: mongoose.Types.ObjectId;
  hostId: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalNights: number;
  basePrice: number;  // Per night price at time of booking
  cleaningFee: number;
  serviceFee: number;
  taxAmount: number;
  taxRate: number;
  discountAmount: number;
  discountType: 'none' | 'weekly' | 'monthly' | 'special';
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  specialRequests?: string;
  cancellationReason?: string;
  cancellationDate?: Date;
  refundAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define booking schema
const BookingSchema = new Schema<IBooking>(
  {
    propertyId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Property',
      required: [true, 'Property ID is required']
    },
    guestId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: [true, 'Guest ID is required']
    },
    hostId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: [true, 'Host ID is required']
    },
    checkIn: { 
      type: Date, 
      required: [true, 'Check-in date is required']
    },
    checkOut: { 
      type: Date, 
      required: [true, 'Check-out date is required']
    },
    guests: { 
      type: Number, 
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest is required']
    },
    totalNights: { 
      type: Number, 
      required: [true, 'Total nights is required'],
      min: [1, 'Booking must be for at least 1 night']
    },
    basePrice: { 
      type: Number, 
      required: [true, 'Base price is required'],
      min: [0, 'Base price cannot be negative']
    },
    cleaningFee: { 
      type: Number, 
      required: [true, 'Cleaning fee is required'],
      min: [0, 'Cleaning fee cannot be negative']
    },
    serviceFee: { 
      type: Number, 
      required: [true, 'Service fee is required'],
      min: [0, 'Service fee cannot be negative']
    },
    taxAmount: { 
      type: Number, 
      required: [true, 'Tax amount is required'],
      min: [0, 'Tax amount cannot be negative']
    },
    taxRate: { 
      type: Number, 
      required: [true, 'Tax rate is required'],
      min: [0, 'Tax rate cannot be negative']
    },
    discountAmount: { 
      type: Number, 
      default: 0,
      min: [0, 'Discount amount cannot be negative']
    },
    discountType: { 
      type: String, 
      enum: ['none', 'weekly', 'monthly', 'special'],
      default: 'none'
    },
    totalAmount: { 
      type: Number, 
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative']
    },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'completed', 'cancelled_by_guest', 'cancelled_by_host', 'rejected'],
      default: 'pending'
    },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'completed', 'refunded', 'partially_refunded', 'failed'],
      default: 'pending'
    },
    paymentId: { 
      type: String
    },
    specialRequests: { 
      type: String,
      maxlength: [500, 'Special requests cannot exceed 500 characters']
    },
    cancellationReason: { 
      type: String,
      maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
    },
    cancellationDate: { 
      type: Date
    },
    refundAmount: { 
      type: Number,
      min: [0, 'Refund amount cannot be negative']
    }
  },
  { 
    timestamps: true 
  }
);

// Create indexes for efficient querying
BookingSchema.index({ propertyId: 1 });
BookingSchema.index({ guestId: 1 });
BookingSchema.index({ hostId: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ paymentStatus: 1 });
BookingSchema.index({ checkIn: 1 });
BookingSchema.index({ checkOut: 1 });
BookingSchema.index({ createdAt: 1 });

// Define Booking model (only create if it doesn't exist)
const Booking: Model<IBooking> = mongoose.models.Booking || 
  mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;

import mongoose, { Schema, Document, Model } from 'mongoose';

// Define property types
export type PropertyType = 
  | 'apartment' 
  | 'house' 
  | 'guesthouse' 
  | 'hotel' 
  | 'villa' 
  | 'cottage' 
  | 'bungalow'
  | 'farmhouse'
  | 'treehouse'
  | 'boat'
  | 'other';

// Define amenity types
export type Amenity = 
  | 'wifi' 
  | 'kitchen' 
  | 'ac' 
  | 'heating' 
  | 'tv' 
  | 'washer' 
  | 'dryer' 
  | 'parking'
  | 'elevator'
  | 'pool'
  | 'hot_tub'
  | 'gym'
  | 'breakfast'
  | 'workspace'
  | 'fireplace'
  | 'bbq'
  | 'indoor_fireplace'
  | 'smoking_allowed'
  | 'pets_allowed'
  | 'events_allowed';

// Define location interface
export interface ILocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Define pricing interface
export interface IPricing {
  basePrice: number; // per night in INR
  cleaningFee: number; // in INR
  serviceFee: number; // in INR
  taxRate: number; // percentage
  minimumStay: number; // in nights
  maximumStay?: number; // in nights
  discounts?: {
    weekly?: number; // percentage
    monthly?: number; // percentage
  };
}

// Define availability date range
export interface IAvailabilityRange {
  startDate: Date;
  endDate: Date;
}

// Define blocked date range
export interface IBlockedDate {
  startDate: Date;
  endDate: Date;
  reason?: string;
}

// Define image interface
export interface IPropertyImage {
  url: string;
  caption?: string;
  isPrimary: boolean;
}

// Define property interface
export interface IProperty extends Document {
  title: string;
  description: string;
  propertyType: PropertyType;
  hostId: mongoose.Types.ObjectId;
  location: ILocation;
  images: IPropertyImage[];
  amenities: Amenity[];
  pricing: IPricing;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  maxGuests: number;
  availability: IAvailabilityRange[];
  blockedDates: IBlockedDate[];
  houseRules: string[];
  status: 'draft' | 'published' | 'archived';
  rating?: number;
  reviewCount?: number;
  instantBooking: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define property schema
const PropertySchema = new Schema<IProperty>(
  {
    title: { 
      type: String, 
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: { 
      type: String, 
      required: [true, 'Property description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    propertyType: { 
      type: String, 
      required: [true, 'Property type is required'],
      enum: {
        values: [
          'apartment', 'house', 'guesthouse', 'hotel', 'villa', 
          'cottage', 'bungalow', 'farmhouse', 'treehouse', 'boat', 'other'
        ],
        message: '{VALUE} is not a valid property type'
      }
    },
    hostId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: [true, 'Host ID is required']
    },
    location: {
      address: { 
        type: String, 
        required: [true, 'Address is required'],
        trim: true
      },
      city: { 
        type: String, 
        required: [true, 'City is required'],
        trim: true
      },
      state: { 
        type: String, 
        required: [true, 'State is required'],
        trim: true
      },
      zipCode: { 
        type: String, 
        required: [true, 'Zip code is required'],
        trim: true
      },
      country: { 
        type: String, 
        required: [true, 'Country is required'],
        default: 'India',
        trim: true
      },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    images: [{
      url: { 
        type: String, 
        required: [true, 'Image URL is required']
      },
      caption: String,
      isPrimary: { 
        type: Boolean, 
        default: false
      }
    }],
    amenities: [{
      type: String,
      enum: {
        values: [
          'wifi', 'kitchen', 'ac', 'heating', 'tv', 'washer', 'dryer', 'parking',
          'elevator', 'pool', 'hot_tub', 'gym', 'breakfast', 'workspace', 'fireplace',
          'bbq', 'indoor_fireplace', 'smoking_allowed', 'pets_allowed', 'events_allowed'
        ],
        message: '{VALUE} is not a valid amenity'
      }
    }],
    pricing: {
      basePrice: { 
        type: Number, 
        required: [true, 'Base price is required'],
        min: [100, 'Base price must be at least ₹100']
      },
      cleaningFee: { 
        type: Number, 
        default: 0,
        min: [0, 'Cleaning fee cannot be negative']
      },
      serviceFee: { 
        type: Number, 
        default: 0,
        min: [0, 'Service fee cannot be negative']
      },
      taxRate: { 
        type: Number, 
        default: 18, // 18% GST
        min: [0, 'Tax rate cannot be negative'],
        max: [100, 'Tax rate cannot exceed 100%']
      },
      minimumStay: { 
        type: Number, 
        default: 1,
        min: [1, 'Minimum stay must be at least 1 night']
      },
      maximumStay: { 
        type: Number,
        min: [1, 'Maximum stay must be at least 1 night']
      },
      discounts: {
        weekly: { 
          type: Number,
          min: [0, 'Weekly discount cannot be negative'],
          max: [100, 'Weekly discount cannot exceed 100%']
        },
        monthly: { 
          type: Number,
          min: [0, 'Monthly discount cannot be negative'],
          max: [100, 'Monthly discount cannot exceed 100%']
        }
      }
    },
    bedrooms: { 
      type: Number, 
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Bedrooms cannot be negative']
    },
    beds: { 
      type: Number, 
      required: [true, 'Number of beds is required'],
      min: [1, 'Property must have at least 1 bed']
    },
    bathrooms: { 
      type: Number, 
      required: [true, 'Number of bathrooms is required'],
      min: [0, 'Bathrooms cannot be negative']
    },
    maxGuests: { 
      type: Number, 
      required: [true, 'Maximum number of guests is required'],
      min: [1, 'Property must accommodate at least 1 guest']
    },
    availability: [{
      startDate: { 
        type: Date, 
        required: [true, 'Start date is required']
      },
      endDate: { 
        type: Date, 
        required: [true, 'End date is required']
      }
    }],
    blockedDates: [{
      startDate: { 
        type: Date, 
        required: [true, 'Start date is required']
      },
      endDate: { 
        type: Date, 
        required: [true, 'End date is required']
      },
      reason: String
    }],
    houseRules: [String],
    status: { 
      type: String, 
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    rating: { 
      type: Number,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    reviewCount: { 
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative']
    },
    instantBooking: { 
      type: Boolean, 
      default: false
    }
  },
  { 
    timestamps: true 
  }
);

// Create indexes for efficient querying
PropertySchema.index({ 'location.city': 1 });
PropertySchema.index({ 'location.state': 1 });
PropertySchema.index({ 'location.country': 1 });
PropertySchema.index({ hostId: 1 });
PropertySchema.index({ propertyType: 1 });
PropertySchema.index({ 'pricing.basePrice': 1 });
PropertySchema.index({ status: 1 });
PropertySchema.index({ instantBooking: 1 });

// Define Property model (only create if it doesn't exist)
const Property: Model<IProperty> = mongoose.models.Property || 
  mongoose.model<IProperty>('Property', PropertySchema);

export default Property;

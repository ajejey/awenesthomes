import mongoose, { Schema, Document, Model } from 'mongoose';
import { UserRole } from '../../app/auth';

// User interface
export interface IUser extends Document {
  email: string;
  name?: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// OTP interface
export interface IOTP extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

// User schema
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['guest', 'host', 'admin'],
      default: 'guest',
    },
    profileImage: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// OTP schema
const OTPSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // OTP expires after 10 minutes
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  }
);

// Check if models are already defined to prevent overwriting during hot reloads
let User: Model<IUser>;
let OTP: Model<IOTP>;

// Initialize models
if (mongoose.models.User) {
  User = mongoose.models.User as Model<IUser>;
} else {
  User = mongoose.model<IUser>('User', UserSchema);
}

if (mongoose.models.OTP) {
  OTP = mongoose.models.OTP as Model<IOTP>;
} else {
  OTP = mongoose.model<IOTP>('OTP', OTPSchema);
}

export { User, OTP };

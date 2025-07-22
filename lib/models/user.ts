import mongoose, { Schema, Document, Model } from 'mongoose';
import { UserRole } from '../../app/auth';

// Government ID interface
export interface IGovernmentId {
  type: string; // passport, driver's license, national ID, etc.
  number?: string; // ID number
  imageUrl: string; // URL to the uploaded ID image
  isVerified: boolean; // Whether the ID has been verified by a host
  verifiedAt?: Date; // When the ID was verified
  verifiedBy?: mongoose.Types.ObjectId; // Which host verified the ID
  uploadedAt: Date; // When the ID was uploaded
}

// User interface
export interface IUser extends Document {
  email: string;
  name?: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
  isVerified: boolean;
  governmentId?: IGovernmentId; // Government ID information
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
      lowercase: true
    },
    name: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['guest', 'host', 'admin'],
      default: 'guest'
    },
    profileImage: {
      type: String
    },
    phone: {
      type: String,
      trim: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    governmentId: {
      type: new Schema({
        type: { type: String, enum: ['aadhar', 'pan_card', 'passport', 'driver_license', 'other'] },
        number: { type: String },
        imageUrl: { type: String },
        isVerified: { type: Boolean, default: false },
        verifiedAt: { type: Date },
        verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        uploadedAt: { type: Date }
      }),
      required: false
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
      lowercase: true
    },
    otp: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600 // OTP expires after 10 minutes
    },
    expiresAt: {
      type: Date,
      required: true
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

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { verifyOTP } from '@/app/auth/login/actions';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
// OTP verification schema
const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface OtpVerificationProps {
  email: string;
  bookingId: string;
  otpSuccess: boolean;
  setOtpSuccess: (success: boolean) => void;
}

export default function OtpVerification({ email, bookingId, otpSuccess, setOtpSuccess }: OtpVerificationProps) {
  console.log('OtpVerification component initialized with:', { email, bookingId });
  const { user, setUser } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP verification
  const onSubmit = async (data: OtpFormData) => {
    try {
      setIsVerifying(true);
      setError(null);
      
      console.log('Verifying OTP for email:', email);
      // Make sure email is defined and passed correctly
      if (!email) {
        throw new Error('Email is required for verification');
      }
      
      const result = await verifyOTP(email, data.otp);
      console.log('Verification result:', result);

      
      if (result.success) {
        setOtpSuccess(true);
        setUser(result.user);
        // need to make accountCreationPending in searchParams false
        router.push(`/bookings/${bookingId}/confirmation?accountCreationPending=false`);
        // Refresh the page to update the UI with the logged-in user
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setError(result.error || 'Failed to verify OTP');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      setIsVerifying(true);
      setError(null);
      
      const result = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }).then(res => res.json());
      
      if (result.success) {
        // Reset timer
        setTimeLeft(600);
        setError(null);
      } else {
        setError(result.error || 'Failed to resend OTP');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while resending OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium text-blue-800 mb-2">Complete Your Account Setup</h3>
      <p className="text-blue-700 mb-4">
        A verification code has been sent to <span className="font-medium">{email}</span>. 
        Enter the 6-digit code below to verify your email and create your account.
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-blue-700">
            Verification Code
          </label>
          <div className="mt-1 relative">
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              className={`block w-full px-4 py-3 border ${
                errors.otp ? 'border-red-300' : 'border-blue-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg tracking-widest text-center`}
              placeholder="123456"
              {...register('otp')}
            />
            {errors.otp && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            )}
          </div>
          {errors.otp && (
            <p className="mt-2 text-sm text-red-600">{errors.otp.message}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-blue-600">
            Time remaining: <span className="font-medium">{formatTime(timeLeft)}</span>
          </p>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={timeLeft > 540 || isVerifying} // Disable for first minute
            className={`text-sm font-medium ${
              timeLeft > 540 || isVerifying
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:text-blue-500'
            }`}
          >
            Resend Code
          </button>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isVerifying ? 'Verifying...' : 'Verify & Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
}

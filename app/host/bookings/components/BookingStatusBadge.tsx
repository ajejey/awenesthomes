'use client';

import React from 'react';
import { BookingStatusSchema } from '@/lib/schemas/booking';
import { z } from 'zod';

type BookingStatus = z.infer<typeof BookingStatusSchema>;

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export default function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  // Define styles for different statuses
  const statusStyles: Record<BookingStatus, { bg: string; text: string; label: string }> = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Pending'
    },
    confirmed: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Confirmed'
    },
    completed: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Completed'
    },
    cancelled_by_guest: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'Cancelled by Guest'
    },
    cancelled_by_host: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'Cancelled by Host'
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Rejected'
    }
  };

  const style = statusStyles[status] || statusStyles.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}

'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDatesChange: (startDate: Date | null, endDate: Date | null) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
  minDays?: number;
  maxDays?: number;
  className?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onDatesChange,
  startPlaceholder = 'Check in',
  endPlaceholder = 'Check out',
  minDays = 1,
  maxDays = 90,
  className = '',
}: DateRangePickerProps) {
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);

  // Close other picker when one is opened
  useEffect(() => {
    if (isStartDateOpen) setIsEndDateOpen(false);
  }, [isStartDateOpen]);

  useEffect(() => {
    if (isEndDateOpen) setIsStartDateOpen(false);
  }, [isEndDateOpen]);

  // Auto-focus end date after selecting start date
  useEffect(() => {
    if (startDate && !endDate && focusedInput === 'startDate') {
      setTimeout(() => {
        setFocusedInput('endDate');
        setIsStartDateOpen(false);
        setIsEndDateOpen(true);
      }, 100);
    }
  }, [startDate, endDate, focusedInput]);

  const handleStartDateChange = (date: Date | null) => {
    let newEndDate = endDate;
    
    // If selecting a start date after current end date, reset end date
    if (date && endDate && date > endDate) {
      newEndDate = null;
    }
    
    onDatesChange(date, newEndDate);
    setFocusedInput('startDate');
  };

  const handleEndDateChange = (date: Date | null) => {
    onDatesChange(startDate, date);
    setFocusedInput('endDate');
  };

  // Custom input components with forwarded refs
  const StartDateInput = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ onClick, value, ...rest }, ref) => (
      <button
        ref={ref}
        onClick={(e) => {
          onClick?.(e);
          setIsStartDateOpen(true);
          setFocusedInput('startDate');
        }}
        className={`w-full text-left focus:outline-none ${
          startDate ? 'text-gray-900' : 'text-gray-500'
        }`}
        type="button"
        {...rest}
      >
        {startDate ? format(startDate, 'MMM d, yyyy') : startPlaceholder}
      </button>
    )
  );
  
  StartDateInput.displayName = 'StartDateInput';

  const EndDateInput = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ onClick, value, ...rest }, ref) => (
      <button
        ref={ref}
        onClick={(e) => {
          onClick?.(e);
          setIsEndDateOpen(true);
          setFocusedInput('endDate');
        }}
        className={`w-full text-left focus:outline-none ${
          endDate ? 'text-gray-900' : 'text-gray-500'
        }`}
        type="button"
        {...rest}
      >
        {endDate ? format(endDate, 'MMM d, yyyy') : endPlaceholder}
      </button>
    )
  );
  
  EndDateInput.displayName = 'EndDateInput';

  return (
    <div className={`flex flex-col md:flex-row ${className}`}>
      <div className="relative flex-1 min-w-0">
        <div className="px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {startPlaceholder}
          </label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            customInput={<StartDateInput />}
            open={isStartDateOpen}
            onClickOutside={() => setIsStartDateOpen(false)}
            calendarClassName="bg-white shadow-lg rounded-lg border border-gray-200"
            wrapperClassName="w-full"
            dateFormat="MMM d, yyyy"
          />
        </div>
        <AnimatePresence>
          {isStartDateOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-1 left-0 md:left-auto"
            >
              {/* Calendar will be rendered here by react-datepicker */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex-1 min-w-0">
        <div className="px-4 py-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {endPlaceholder}
          </label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate ? addDays(startDate, minDays - 1) : new Date()}
            maxDate={startDate && maxDays ? addDays(startDate, maxDays - 1) : undefined}
            customInput={<EndDateInput />}
            open={isEndDateOpen}
            onClickOutside={() => setIsEndDateOpen(false)}
            calendarClassName="bg-white shadow-lg rounded-lg border border-gray-200"
            wrapperClassName="w-full"
            dateFormat="MMM d, yyyy"
            disabled={!startDate}
          />
        </div>
        <AnimatePresence>
          {isEndDateOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-1 left-0 md:right-0"
            >
              {/* Calendar will be rendered here by react-datepicker */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

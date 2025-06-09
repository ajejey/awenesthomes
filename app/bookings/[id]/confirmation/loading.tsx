import BookingConfirmationSkeleton from './components/BookingConfirmationSkeleton';

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BookingConfirmationSkeleton />
    </div>
  );
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Details | Host Dashboard | AweNest Homes',
  description: 'View and manage your property details',
};

export default function PropertyDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}

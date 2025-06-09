import React from 'react';
import { getCurrentUser } from '@/app/auth.js';
// Use explicit relative imports with file extension
import { getUserProfile } from './actions.js';
import ProfileTabs from './components/ProfileTabs.js';

export default async function ProfilePage() {
  // Get the current user from the JWT token
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    // This should not happen due to requireAuth in layout
    return null;
  }
  
  // Get the user's profile data
  const profile = await getUserProfile(currentUser.id);
  
  return (
    <div className="divide-y divide-gray-200">
      {/* User information section */}
      <div className="px-4 py-5 sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your personal information and contact details
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.phone || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Account type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{profile.role}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Member since</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(profile.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile tabs for different sections */}
      <div className="px-4 py-5 sm:p-6">
        <ProfileTabs userId={currentUser.id} role={currentUser.role} />
      </div>
    </div>
  );
}

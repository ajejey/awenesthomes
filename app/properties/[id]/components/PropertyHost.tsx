'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { ShieldCheckIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface HostProps {
  _id: string;
  name: string;
  email?: string;
  image?: string;
  bio?: string;
  phoneNumber?: string;
  joinedDate?: string;
}

interface PropertyHostProps {
  host: HostProps;
}

export default function PropertyHost({ host }: PropertyHostProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Format join date
  const joinDate = host.joinedDate ? format(parseISO(host.joinedDate), 'MMMM yyyy') : null;
  
  // Handle contact form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }
    
    try {
      setIsSending(true);
      setError(null);
      
      // In a real implementation, this would send a message to the host
      // For now, we'll simulate a successful message send
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSent(true);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Hosted by {host.name}</h2>
      
      <div className="flex items-start">
        {/* Host image */}
        <div className="flex-shrink-0 mr-4">
          {host.image ? (
            <Image
              src={host.image}
              alt={host.name}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xl font-medium">
                {host.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        {/* Host info */}
        <div className="flex-1">
          <div className="space-y-2 mb-4">
            {joinDate && (
              <p className="text-gray-600 text-sm">
                Host since {joinDate}
              </p>
            )}
            
            {host.bio && (
              <p className="text-gray-700">{host.bio}</p>
            )}
            
            <div className="flex items-center text-gray-600 text-sm">
              <ShieldCheckIcon className="h-4 w-4 mr-1 text-green-600" />
              <span>Identity verified</span>
            </div>
          </div>
          
          {/* Contact host button */}
          {!showContactForm && !isSent && (
            <button
              onClick={() => setShowContactForm(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
              Contact host
            </button>
          )}
          
          {/* Contact form */}
          {showContactForm && !isSent && (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message to host
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Introduce yourself and ask any questions you have about the property..."
                  />
                </div>
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSending ? 'Sending...' : 'Send message'}
                </button>
              </div>
            </form>
          )}
          
          {/* Success message */}
          {isSent && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Message sent successfully! {host.name} will get back to you soon.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

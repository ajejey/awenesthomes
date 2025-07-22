'use client';

import React from 'react';
import { UseFormRegister, FormState } from 'react-hook-form';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface TermsStepProps {
  register: UseFormRegister<any>;
  errors: FormState<any>['errors'];
}

export default function TermsStep({ register, errors }: TermsStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-700">
          Please review and agree to our terms and conditions to proceed with managed hosting.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">AweNestHost Managed Hosting Terms</h3>
          <div className="mt-4 max-h-60 overflow-y-auto prose prose-sm text-gray-700">
            <p>
              By agreeing to these terms, you are entering into a management agreement with AweNestHost for your property. Please read the following terms carefully:
            </p>
            
            <h4>1. Management Services</h4>
            <p>
              AweNestHost will provide property management services as outlined in your selected management preference (Full or Partial Management). These services include but are not limited to guest communication, pricing optimization, booking management, and coordination of cleaning and maintenance services.
            </p>
            
            <h4>2. Commission Structure</h4>
            <p>
              AweNestHost charges a commission on all bookings made through our platform. The commission rate is based on your selected management preference:
            </p>
            <ul>
              <li>Full Management: 20% of booking revenue</li>
              <li>Partial Management: 15% of booking revenue</li>
            </ul>
            <p>
              Commission is calculated on the total booking amount before taxes and fees. Payment will be processed within 24 hours of guest check-in.
            </p>
            
            <h4>3. Property Access</h4>
            <p>
              You agree to provide AweNestHost with access to your property for the purpose of guest check-ins, maintenance, cleaning, and quality inspections.
            </p>
            
            <h4>4. Term and Termination</h4>
            <p>
              The initial term of this agreement is 6 months. After the initial term, either party may terminate the agreement with 30 days written notice.
            </p>
            
            <h4>5. Property Standards</h4>
            <p>
              You agree to maintain your property in a safe, clean, and habitable condition that meets AweNestHost's quality standards. AweNestHost reserves the right to require necessary repairs or improvements to maintain these standards.
            </p>
          </div>
        </div>
        
        <div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreeToTerms"
                type="checkbox"
                {...register('agreeToTerms')}
                className={`focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded ${
                  errors.agreeToTerms ? 'border-red-300' : ''
                }`}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeToTerms" className={`font-medium ${errors.agreeToTerms ? 'text-red-700' : 'text-gray-700'}`}>
                I agree to the AweNestHost Managed Hosting Terms *
              </label>
            </div>
          </div>
          {errors.agreeToTerms && (
            <p className="mt-2 text-sm text-red-600" id="agreeToTerms-error">
              {errors.agreeToTerms.message as string}
            </p>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Commission Structure Agreement</h3>
          <div className="mt-4 prose prose-sm text-gray-700">
            <p>
              I understand and agree that AweNestHost will charge a commission on all bookings made through the platform based on my selected management preference:
            </p>
            <ul>
              <li>Full Management: 20% of booking revenue</li>
              <li>Partial Management: 15% of booking revenue</li>
            </ul>
            <p>
              I understand that this commission will be deducted from the booking amount before payment is transferred to me. I also understand that additional fees may apply for optional services as outlined in the full terms and conditions.
            </p>
          </div>
        </div>
        
        <div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreeToCommission"
                type="checkbox"
                {...register('agreeToCommission')}
                className={`focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded ${
                  errors.agreeToCommission ? 'border-red-300' : ''
                }`}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeToCommission" className={`font-medium ${errors.agreeToCommission ? 'text-red-700' : 'text-gray-700'}`}>
                I agree to the commission structure *
              </label>
            </div>
          </div>
          {errors.agreeToCommission && (
            <p className="mt-2 text-sm text-red-600" id="agreeToCommission-error">
              {errors.agreeToCommission.message as string}
            </p>
          )}
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-yellow-800">Next Steps</h4>
        <p className="mt-1 text-sm text-yellow-700">
          After submitting your application, our management team will contact you within 24 hours to discuss your property in detail, answer any questions, and schedule an initial property assessment.
        </p>
      </div>
    </div>
  );
}

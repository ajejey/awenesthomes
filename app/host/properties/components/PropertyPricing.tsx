import { CurrencyRupeeIcon } from '@heroicons/react/24/outline';

type PricingDetails = {
  basePrice: number;
  cleaningFee?: number;
  serviceFee?: number;
  taxRate?: number;
  minimumStay?: number;
  maximumStay?: number;
  discounts?: {
    weekly?: number;
    monthly?: number;
  };
};

type PropertyPricingProps = {
  pricing: PricingDetails;
};

export default function PropertyPricing({ pricing }: PropertyPricingProps) {
  return (
    <section className="border border-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <CurrencyRupeeIcon className="h-5 w-5 text-gray-500" />
        Pricing
      </h2>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Base Price</span>
          <span className="font-medium text-gray-900">₹{pricing.basePrice.toLocaleString()}/night</span>
        </div>
        
        {pricing.cleaningFee !== undefined && pricing.cleaningFee > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Cleaning Fee</span>
            <span className="font-medium text-gray-900">₹{pricing.cleaningFee.toLocaleString()}</span>
          </div>
        )}
        
        {pricing.serviceFee !== undefined && pricing.serviceFee > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Service Fee</span>
            <span className="font-medium text-gray-900">₹{pricing.serviceFee.toLocaleString()}</span>
          </div>
        )}
        
        {pricing.taxRate !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Tax Rate</span>
            <span className="font-medium text-gray-900">{pricing.taxRate}%</span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Minimum Stay</span>
          <span className="font-medium text-gray-900">{pricing.minimumStay || 1} night(s)</span>
        </div>
        
        {pricing.maximumStay && (
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Maximum Stay</span>
            <span className="font-medium text-gray-900">{pricing.maximumStay} night(s)</span>
          </div>
        )}
        
        {/* Discounts */}
        {pricing.discounts && (Object.values(pricing.discounts).some(val => val !== undefined && val > 0)) && (
          <>
            <div className="border-t border-gray-200 my-3"></div>
            <h3 className="text-md font-medium text-gray-900 mb-2">Discounts</h3>
            
            {pricing.discounts.weekly !== undefined && pricing.discounts.weekly > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Weekly Discount</span>
                <span className="font-medium text-green-600">{pricing.discounts.weekly}%</span>
              </div>
            )}
            
            {pricing.discounts.monthly !== undefined && pricing.discounts.monthly > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Monthly Discount</span>
                <span className="font-medium text-green-600">{pricing.discounts.monthly}%</span>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

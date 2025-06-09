/**
 * Interface for property card data used in listings
 */
export interface IPropertyCard {
  _id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
  host: {
    name: string;
  };
}

/**
 * Interface for search parameters
 */
export interface ISearchParams {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

/**
 * Interface for booking data
 */
export interface IBookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
}

/**
 * Interface for pricing breakdown
 */
export interface IPricingBreakdown {
  basePrice: number;
  nights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  total: number;
  discount?: number;
}

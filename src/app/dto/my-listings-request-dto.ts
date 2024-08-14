import { ApartmentListing } from '../models/apartment-listing';

export interface MyListingsRequestDTO {
  listings: ApartmentListing[];
  message: string;
  messageSeverity: string;
}

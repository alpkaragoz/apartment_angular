import { ApartmentListing } from '../models/apartment-listing';

export interface FilteredListingsRequestDto {
  listings: ApartmentListing[];
  totalPages: number;
}

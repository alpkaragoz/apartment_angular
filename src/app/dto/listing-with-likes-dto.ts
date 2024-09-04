import { ApartmentListing } from '../models/apartment-listing';

export interface ListingWithLikesDto {
  listing: ApartmentListing;
  likes: number;
}

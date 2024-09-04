import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { ApartmentListing } from '../models/apartment-listing';
import { LoginRequestDTO } from '../dto/login-request-dto';
import { MessageRequestDTO } from '../dto/message-request-dto';
import { MyListingsRequestDTO } from '../dto/my-listings-request-dto';
import { rentSale } from '../models/rent-sale';
import { FilteredListingsRequestDto } from '../dto/filtered-listings-request-dto';
import { ListingWithLikesDto } from '../dto/listing-with-likes-dto';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ID_KEY = 'auth_id';

  private listingUpdatedSource = new Subject<void>();
  listingUpdated$ = this.listingUpdatedSource.asObservable();

  constructor(private http: HttpClient) {}

  notifyListingUpdated() {
    this.listingUpdatedSource.next();
  }

  login(user: { email: string; password: string }): Observable<HttpResponse<LoginRequestDTO>> {
    const apiUrl = 'http://localhost:8080/api/auth/tokens';
    return this.http.post<LoginRequestDTO>(apiUrl, user, {
      observe: 'response',
    });
  }

  isTokenValid(): Observable<HttpResponse<void>> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    const apiUrl = 'http://localhost:8080/api/auth/tokens';
    return this.http.get<void>(apiUrl, { headers, observe: 'response' });
  }

  register(user: { email: string; password: string }): Observable<HttpResponse<MessageRequestDTO>> {
    const apiUrl = 'http://localhost:8080/api/users';
    return this.http.post<MessageRequestDTO>(apiUrl, user, {
      observe: 'response',
    });
  }

  getUserListings(): Observable<HttpResponse<MyListingsRequestDTO>> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    const userId = this.getId();
    const apiUrl = `http://localhost:8080/api/users/${userId}/apartments`;
    return this.http.get<MyListingsRequestDTO>(apiUrl, { headers, observe: 'response' });
  }

  updateMyListing(listing: ApartmentListing): Observable<HttpResponse<MessageRequestDTO>> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    const userId = this.getId();
    const apiUrl = `http://localhost:8080/api/users/${userId}/apartments/${listing.id}`;
    return this.http
      .put<MessageRequestDTO>(apiUrl, listing, { headers, observe: 'response' })
      .pipe(tap(() => this.notifyListingUpdated()));
  }

  deleteUserListing(apartmentId: number): Observable<HttpResponse<MessageRequestDTO>> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    const userId = this.getId();
    const apiUrl = `http://localhost:8080/api/users/${userId}/apartments/${apartmentId}`;
    return this.http
      .delete<MessageRequestDTO>(apiUrl, { headers, observe: 'response' })
      .pipe(tap(() => this.notifyListingUpdated()));
  }

  createListing(listing: ApartmentListing): Observable<HttpResponse<MessageRequestDTO>> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    const userId = this.getId();
    const apiUrl = `http://localhost:8080/api/users/${userId}/apartments`;
    return this.http
      .post<MessageRequestDTO>(apiUrl, listing, { headers, observe: 'response' })
      .pipe(tap(() => this.notifyListingUpdated()));
  }

  getFilteredApartmentListings(
    rentSale?: rentSale,
    minPrice?: number,
    maxPrice?: number,
    address?: string,
    listingName?: string,
    page?: number,
    size?: number
  ): Observable<HttpResponse<FilteredListingsRequestDto>> {
    let params = new HttpParams();
    const headers = { Authorization: `Bearer ${this.getToken()}` };

    if (rentSale) {
      params = params.set('rentSale', rentSale);
    }
    if (minPrice !== undefined) {
      params = params.set('minPrice', minPrice.toString());
    }
    if (maxPrice !== undefined) {
      params = params.set('maxPrice', maxPrice.toString());
    }
    if (address) {
      params = params.set('address', address);
    }
    if (listingName) {
      params = params.set('listingName', listingName);
    }
    if (page !== undefined) {
      params = params.set('page', page.toString());
    }
    if (size !== undefined) {
      params = params.set('size', size.toString());
    }

    return this.http.get<FilteredListingsRequestDto>(`http://localhost:8080/api/apartments`, {
      headers,
      params,
      observe: 'response',
    });
  }

  getLikedListings(): Observable<number[]> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    const userId = this.getId();
    const apiUrl = `http://localhost:8080/api/users/${userId}/favorites`;
    return this.http.get<number[]>(apiUrl, { headers });
  }

  addFavorite(listingId: number): Observable<MessageRequestDTO> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    const userId = this.getId();
    const apiUrl = `http://localhost:8080/api/favorites?userId=${userId}&listingId=${listingId}`;
    return this.http.post<MessageRequestDTO>(apiUrl, {}, { headers });
  }

  removeFavorite(listingId: number): Observable<MessageRequestDTO> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    const userId = this.getId();
    const apiUrl = `http://localhost:8080/api/favorites?userId=${userId}&listingId=${listingId}`;
    return this.http.delete<MessageRequestDTO>(apiUrl, { headers });
  }

  getListingsWithLikes(): Observable<HttpResponse<ListingWithLikesDto[]>> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    const userId = this.getId();
    const apiUrl = `http://localhost:8080/api/favorites/listings?userId=${userId}`;
    return this.http.get<ListingWithLikesDto[]>(apiUrl, { headers, observe: 'response' });
  }

  saveCredentials(token: string, id: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.ID_KEY, id);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeId() {
    localStorage.removeItem(this.ID_KEY);
  }

  getId(): string | null {
    return localStorage.getItem(this.ID_KEY);
  }
}

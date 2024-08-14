import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { ApartmentListing } from '../models/apartment-listing';
import { LoginRequestDTO } from '../dto/login-request-dto';
import { MessageRequestDTO } from '../dto/message-request-dto';
import { MyListingsRequestDTO } from '../dto/my-listings-request-dto';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly TOKEN_KEY = 'auth_token';

  private listingUpdatedSource = new Subject<void>();
  listingUpdated$ = this.listingUpdatedSource.asObservable();

  constructor(private http: HttpClient) {}

  notifyListingUpdated() {
    this.listingUpdatedSource.next();
  }

  login(user: { email: string; password: string }): Observable<HttpResponse<LoginRequestDTO>> {
    const apiUrl = 'http://localhost:8080/api/users/login';
    return this.http.post<LoginRequestDTO>(apiUrl, user, {
      observe: 'response',
    });
  }

  register(user: { email: string; password: string }): Observable<HttpResponse<MessageRequestDTO>> {
    const apiUrl = 'http://localhost:8080/api/users/register';
    return this.http.post<MessageRequestDTO>(apiUrl, user, {
      observe: 'response',
    });
  }

  getApartmentList(): Observable<ApartmentListing[]> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    const apiUrl = 'http://localhost:8080/api/apartments/lists';
    return this.http.get<ApartmentListing[]>(apiUrl, { headers });
  }

  getMyListings(): Observable<HttpResponse<MyListingsRequestDTO>> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    const apiUrl = 'http://localhost:8080/api/apartments/my-listings';
    return this.http.get<MyListingsRequestDTO>(apiUrl, { headers, observe: 'response' });
  }

  updateMyListing(listing: ApartmentListing): Observable<HttpResponse<MessageRequestDTO>> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    const apiUrl = 'http://localhost:8080/api/apartments/my-listings/edit';
    return this.http.post<MessageRequestDTO>(apiUrl, listing, { headers, observe: 'response' }).pipe(tap(() => this.notifyListingUpdated()));
  }

  deleteMyListing(listing: ApartmentListing): Observable<HttpResponse<MessageRequestDTO>> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    const apiUrl = 'http://localhost:8080/api/apartments/my-listings/delete';
    return this.http.post<MessageRequestDTO>(apiUrl, listing, { headers, observe: 'response' }).pipe(tap(() => this.notifyListingUpdated()));
  }

  createListing(listing: ApartmentListing): Observable<HttpResponse<MessageRequestDTO>> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    const apiUrl = 'http://localhost:8080/api/apartments/create-listing';
    return this.http.post<MessageRequestDTO>(apiUrl, listing, { headers, observe: 'response' }).pipe(tap(() => this.notifyListingUpdated()));
  }

  isTokenValid(): Observable<HttpResponse<MessageRequestDTO>> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    const apiUrl = 'http://localhost:8080/api/validate-token';
    return this.http.get<MessageRequestDTO>(apiUrl, { headers, observe: 'response' });
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}

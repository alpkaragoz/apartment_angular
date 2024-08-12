import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApartmentListing } from '../models/apartment-listing';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) { }

  login(user: { email: string; password: string }): Observable<HttpResponse<any>> {
    const apiUrl = 'http://localhost:8080/api/users/login';
    return this.http.post<HttpResponse<any>>(apiUrl, user, {observe: 'response'});
  }

  register(user: { email: string; password: string }): Observable<HttpResponse<any>> {
    const apiUrl = 'http://localhost:8080/api/users/register';
    return this.http.post<HttpResponse<any>>(apiUrl, user, {observe: 'response'});
  }

  getApartmentList(): Observable<ApartmentListing[]> {
    const headers = {'Authorization': `Bearer ${this.getToken()}`};
    const apiUrl = 'http://localhost:8080/api/apartments/list';
    return this.http.get<ApartmentListing[]>(apiUrl, {headers});
  }

  getMyListings(): Observable<HttpResponse<any>> {
    const headers = {'Authorization': `Bearer ${this.getToken()}`};
    const apiUrl = 'http://localhost:8080/api/apartments/my-listings';
    return this.http.get<any>(apiUrl, {headers, observe: 'response'});
  }

  createListing(listing: ApartmentListing): Observable<HttpResponse<any>> {
    const headers = {'Authorization': `Bearer ${this.getToken()}`};
    const apiUrl = 'http://localhost:8080/api/apartments/create-listing';
    return this.http.post<any>(apiUrl, listing, {headers, observe: 'response'});
  }

  isTokenValid(): Observable<HttpResponse<any>> {
    const headers = {'Authorization': `Bearer ${this.getToken()}`};
    const apiUrl = 'http://localhost:8080/api/validate-token';
    return this.http.get<any>(apiUrl, {headers, observe: 'response'});
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): String | null{
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(private apiService: ApiService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.apiService.isTokenValid().pipe(
      map(response => {
        if (response.status === 200) {
          return true;
        } else {
          this.router.navigate(['']); 
          return false;
        }
      }),
      catchError(err => {
        this.router.navigate(['']);
        window.alert('Your session has expired. Please log in again.');
        return of(false);
      })
    );
  }
}
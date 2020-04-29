import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  /**
   * Clase que recibe los errores HTTP.
   * Usada para administrar estos errores de manera centralizada.
   */
  constructor(
    public authService: AuthService
  ) { }

  /**
   * Handles error
   * @param error type `HttpErrorResponse`
   * @returns throwError
   */
  handleError(error: HttpErrorResponse) {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.log(
      `Backend returned code ${error.status}, `);
    console.log(error);

    if (error.status === 401) {
      this.authService.logout();
    }
    // return an observable with a user-facing error message
    return throwError(error.error);
  }
}

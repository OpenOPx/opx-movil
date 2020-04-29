import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad {

  constructor(private authService: AuthService) { }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.checkToken();
  }

}

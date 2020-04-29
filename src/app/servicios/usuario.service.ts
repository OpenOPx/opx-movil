import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import { NetworkService, ConnectionStatus } from './network.service';
import { environment } from 'src/environments/environment';
import { DataLocalService } from './data-local.service';
import { ErrorService } from './error.service';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user';

const URL = environment.API_URL + '/usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  /**
   * Servicio relacionado con la gestión del usuario logueado
   */
  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private errorService: ErrorService,
    private networkService: NetworkService,
    private dataLocalService: DataLocalService
  ) { }

  /**
   * Obtiene información detallada de un usuario
   * @param id identificación de un usuario
   */
  detalleUsuario(id: string) {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.usuario());
    } else {
      const headers = new HttpHeaders({ Authorization: this.authService.token });
      return this.http.get(`${URL}/detail/${id}`, { headers })
        .pipe(map((resp: any) => {
          if (this.authService.getUser().rolname !== resp.usuario.rol) {
            this.authService.logout();
          }
          this.dataLocalService.usuario(resp.usuario);
          return resp.usuario;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }

  /**
   * Actualiza la información de un usuario
   * SOLO ONLINE
   */
  editarUsuario(usuario: User) {
    const headers = new HttpHeaders({
      Authorization: this.authService.token,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const querystring = this.authService.querystring(usuario);
    return this.http.post(`${URL}/${this.authService.user.userid}`, querystring, { headers })
      .pipe(map(async (resp: any) => {
        let user = this.authService.getUser();
        user.userfullname = resp.usuario.fields.userfullname;
        this.authService.saveUser(user);
      }), catchError(e => this.errorService.handleError(e)));
  }
}

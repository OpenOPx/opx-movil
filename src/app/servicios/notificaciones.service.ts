import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import { NetworkService, ConnectionStatus } from './network.service';
import { environment } from 'src/environments/environment';
import { DataLocalService } from './data-local.service';
import { ErrorService } from './error.service';
import { AuthService } from './auth.service';

const URL = environment.API_URL + '/notificaciones';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

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
   * @description Lista las notificaciones del usuario
   */
  listarNotificaciones() {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      console.log("Entro a la red")
      return from(this.dataLocalService.listarNotificaciones());
    } else {
      const headers = new HttpHeaders({ Authorization: this.authService.token });
      return this.http.get(`${URL}/list/`, { headers })
        .pipe(map((resp: any) => {
          this.dataLocalService.guardarNotificaciones(resp.data);
          return resp.data;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }

  /**
   * @description Elimina el listado de notificaciones del usuario
   * SOLO ONLINE
   */
  eliminarNotificaciones() {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    //Eliminar no sé que tipo de solicitud envia
    return this.http.delete(`${URL}/delete/`, { headers })
      .pipe(map((resp: any) => {
        this.dataLocalService.vaciarNotificaciones();
        return resp.notificaciones
      }), catchError(e => this.errorService.handleError(e)));
  }
}

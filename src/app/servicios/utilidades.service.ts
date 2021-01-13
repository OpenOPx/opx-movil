import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import { NetworkService, ConnectionStatus } from './network.service';
import { environment } from 'src/environments/environment';
import { DataLocalService } from './data-local.service';
import { ErrorService } from './error.service';
import { AuthService } from './auth.service';

const URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  /**
   * @description Servicio que carga utilidades que son comunes en la aplicación móvil.
   */
  constructor(
    private errorService: ErrorService,
    private http: HttpClient,
    private authService: AuthService,
    private networkService: NetworkService,
    private dataLocalService: DataLocalService
  ) { }

  /**
   * @description Obtiene la lista de generos. Si está offline, obtiene la lista de generos localmente del STORAGE. De lo contrario los obtiene del servidor
   */
  listaGeneros() {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.generos());
    } else {
      return this.http.get(URL + '/generos/list/')
        .pipe(map((resp: any) => {
          this.dataLocalService.generos(resp.generos);
          return resp.generos;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }

  /**
   * @description Carga los niveles educativos. Si está offline, obtiene la lista de niveles educativos localmente del STORAGE. De lo contrario los obtiene del servidor
   */
  listaNivelesEducativos() {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.nivelesEducativos());
    } else {
      return this.http.get(URL + '/niveles-educativos/list/')
        .pipe(map((resp: any) => {
          this.dataLocalService.nivelesEducativos(resp.nivelesEducativos);
          return resp.nivelesEducativos;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }

  /**
   * @description Barrios disponibles en la plataforma. Si está offline, obtiene la lista de barrios localmente del STORAGE. De lo contrario los obtiene del servidor
   */
  listaBarrios() {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.barrios());
    } else {
      return this.http.get(URL + '/barrios/list/')
        .pipe(map((resp: any) => {
          this.dataLocalService.barrios(resp.barrios);
          return resp.barrios;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }

  /**
   * @description Elementos disponibles para realizar el mapeo.
   */
  listaElementosOSM() {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.elementosOSM());
    } else {
      const headers = new HttpHeaders({
        Authorization: this.authService.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      return this.http.get(URL + '/elementos-osm/list/', { headers })
        .pipe(map((resp: any) => {
          this.dataLocalService.elementosOSM(resp.elementosOSM);
          return resp.elementosOSM;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }
}

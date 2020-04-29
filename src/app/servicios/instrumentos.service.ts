import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { from } from 'rxjs';

import { AuthService } from './auth.service';
import { ErrorService } from './error.service';
import { DataLocalService } from './data-local.service';
import { environment } from 'src/environments/environment';
import { ConnectionStatus, NetworkService } from './network.service';
import { OfflineManagerService } from './offline-manager.service';

const URL = environment.API_URL + '/instrumentos';

@Injectable({
  providedIn: 'root'
})
export class InstrumentosService {

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private errorService: ErrorService,
    private networkService: NetworkService,
    private dataLocalService: DataLocalService,
    private offlineManager: OfflineManagerService
  ) { }

  /**
   * Verifica si una encuesta se encuentra habilitada para ser llenada
   * @param id Identificación del instrumento de tipo encuesta.
   */
  verificarImplementacion(id: string): any {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return this.dataLocalService.cargarVerificarImplementacion(id);
    } else {
      const headers = new HttpHeaders({ Authorization: this.authService.token });
      return new Promise((resolve) => {
        this.http.get(`${URL}/${id}/verificar-implementacion/`, { headers })
          .subscribe((resp: any) => {
            this.dataLocalService.guardarVerificarImplementacion(id, resp.implementacion);
            resolve(resp.implementacion);
          }, (err => {
            resolve(false);
          }));
      });
    }
  }

  /**
   * Enlace usado en iFrame para visualizar la encuesta y poder ser llenada.
   * @param id id Identificación del instrumento de tipo encuesta.
   */
  enlaceFormularioKoboToolbox(id: string) {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.cargarEnlaceFormularioKoboToolbox(id));
    } else {
      const headers = new HttpHeaders({ Authorization: this.authService.token });
      return this.http.get(`${URL}/enlace-formulario/${id}`, { headers })
        .pipe(map((resp: any) => {
          this.dataLocalService.guardarEnlaceFormularioKoboToolbox(id, resp.enlace);
          return resp.enlace;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }

  /**
   * Envía al servicio un nuevo mapeo en la cartografia.
   * @param tareid id Identificación de la tarea de tipo mapa.
   * @param osmelement Tipo de elemento (casa, calle).
   * @param coordinates Coordenadas de mapeo realizado.
   */
  mapeoOSM(tareid: string, osmelement: string, coordinates) {

    const data = JSON.stringify({ osmelement, coordinates });

    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.offlineManager.storeRequest(`${URL}/mapear/${tareid}`, 'POST', data));
    } else {

      const headers = new HttpHeaders({
        Authorization: this.authService.token,
        'Content-Type': 'application/json'
      });
      return this.http.post(`${URL}/mapear/${tareid}`, data, { headers })
        .pipe(map((resp: any) => {
          return resp;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }

  /**
   * Carga los elementos que ya fueron mapeados en un instrumento de tipo cartografía
   * @param tareid id Identificación de la tarea.
   */
  detalleMapeo(tareid: string) {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.cargarDetalleCartografia(tareid));
    } else {
      const headers = new HttpHeaders({ Authorization: this.authService.token });
      return this.http.get(`${URL}/detalle-cartografia/${tareid}`, { headers })
        .pipe(map((resp: any) => {
          this.dataLocalService.guardarDetalleCartografia(tareid, resp.geojson);
          return resp.geojson;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }

  /**
   * Elimina una figura del mapa
   * Usado en el perfil del validador
   */
  eliminarCartografia(id: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.delete(`${URL}/eliminar-cartografia/${id}`, { headers })
      .pipe(catchError(e => this.errorService.handleError(e)));
  }

  /**
   * Trae información respecto de un instrumento por VALIDAR
   * Usado en el perfil del validador
   */
  informacionInstrumento(tareid: string) {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.cargarInformacionInstrumento(tareid));
    } else {
      const headers = new HttpHeaders({ Authorization: this.authService.token });
      return this.http.get(`${URL}/${tareid}/informacion/`, { headers })
        .pipe(map((resp: any) => {
          this.dataLocalService.guardarInformacionInstrumento(tareid, resp.info);
          return resp.info;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }

  /**
   * Proceso que actualiza el estado de una encuesta
   * @param estado 0= Sin Validar; 1 = Mala; 2 = Buena;
   * Usado en el perfil del validador
   */
  revisionEncuesta(idEncuesta: string, estado: number, observacion: string = '') {
    const headers = new HttpHeaders({
      Authorization: this.authService.token,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const data = this.authService.querystring({ estado, observacion });
    return this.http.post(`${URL}/revisar-encuesta/${idEncuesta}`, data, { headers })
      .pipe(catchError(e => this.errorService.handleError(e)));
  }

}

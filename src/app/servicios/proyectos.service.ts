import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import { NetworkService, ConnectionStatus } from './network.service';
import { environment } from 'src/environments/environment';
import { DataLocalService } from './data-local.service';
import { Proyecto } from '../interfaces/proyecto';
import { ErrorService } from './error.service';
import { AuthService } from './auth.service';

const URL = environment.API_URL + '/proyectos';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  pageProyectos = 0;

  /**
   * Servicio que gestiona los proyectos
   */
  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private errorService: ErrorService,
    private networkService: NetworkService,
    private dataLocalService: DataLocalService
  ) { }

  /**
   * Carga la lista de proyectos.
   * Se está Online consulta en el servidor remoto, de lo contario hace una consulta local
   * @param search palabra clave
   * @param pull bandera para traer nueva página. Es usada solo en modo Online
   */
  listadoProyectos(search?: string, pull: boolean = false) {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.listarProyectos(search));
    } else {

      if (pull) {
        this.pageProyectos = 0;
      }
      this.pageProyectos++;

      const url = search ? URL + `/list/?search=${search}` : URL + `/list/?page=${this.pageProyectos}`;
      const headers = new HttpHeaders({ Authorization: this.authService.token || 'null' });

      return this.http.get(url, { headers })
        .pipe(map((resp: any) => {
          this.dataLocalService.guardarProyectos(resp.proyectos);
          return resp;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }

  /**
   * Carga un proyecto en detalle
   */
  detalleProyecto(proyid: string) {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.detalleProyecto(proyid));
    } else {
      const headers = new HttpHeaders({ Authorization: this.authService.token || 'null' });

      return this.http.get(`${URL}/detail/${proyid}`, { headers })
        .pipe(map((resp: any) => {
          resp.detail.proyecto.proyid = proyid;
          this.dataLocalService.guardarDetalleProyecto(resp.detail);
          return resp.detail;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }

  /**
   * Actualiza un proyecto
   * SOLO ONLINE
   */
  actualizarProyecto(proyecto: Proyecto) {
    const headers = new HttpHeaders({
      Authorization: this.authService.token,
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const querystring = this.authService.querystring(proyecto);

    return this.http.post(`${URL}/${proyecto.proyid}`, querystring, { headers })
      .pipe(map((resp: any) => {
        console.log(resp);
        return resp;
      }), catchError(e => this.errorService.handleError(e)));

  }

  /**
   * Obtiene las dimensiones territoriales por proyecto
   */
  dimensionesTerritoriales(proyid: string) {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.cargarDimensionesTerritoriales(proyid));
    } else {
      const headers = new HttpHeaders({ Authorization: this.authService.token });
      return this.http.get(`${URL}/dimensiones-territoriales/${proyid}`, { headers })
        .pipe(map((resp: any) => {
          this.dataLocalService.guardarDimensionesTerritoriales(proyid, resp.dimensionesTerritoriales);
          return resp.dimensionesTerritoriales;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import { ConnectionStatus, NetworkService } from './network.service';
import { environment } from 'src/environments/environment';
import { DataLocalService } from './data-local.service';
import { ErrorService } from './error.service';
import { AuthService } from './auth.service';
import { Tarea } from '../interfaces/tarea';

const URL = environment.API_URL + '/tareas';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  pageTareas = 0;

  /**
   * Servicio que se encarga de gestionar las tareas
   */
  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private errorService: ErrorService,
    private networkService: NetworkService,
    private dataLocalService: DataLocalService
  ) { }


  /**
   * Guarda los cambios de una tarea.
   * SOLO ONLINE
   */
  editarTarea(tarea: Tarea) {
    const headers = new HttpHeaders({
      Authorization: this.authService.token,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const querystring = this.authService.querystring(tarea);

    return this.http.post(`${URL}/${tarea.tareid}`, querystring, { headers })
      .pipe(map((resp: any) => {
        return resp.tarea;
        // this.dataLocalService.guardarDetalleProyecto(resp.tarea);
      }), catchError(e => this.errorService.handleError(e)));

  }

  /**
   * Obtiene una tarea en detalle
   */
  detalleTarea(tareid: string) {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.detalleTarea(tareid));
    } else {
      const headers = new HttpHeaders({ Authorization: this.authService.token });
      return this.http.get(`${URL}/detail/${tareid}`, { headers })
        .pipe(map((resp: any) => {
          this.dataLocalService.guardarDetalleTarea(tareid, resp.tarea);
          return resp.tarea;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }

  /**
   * Carga la lista de tareas disponibles
   * @param search parametro de búsqueda
   */
  listadoTareas(search?: string, pull: boolean = false) {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.listarTareas(search));
    } else {
      const headers = new HttpHeaders({ Authorization: this.authService.token });

      if (pull) {
        this.pageTareas = 0;
      }
      this.pageTareas++;

      const url = search ? URL + `/list/?search=${search}` : URL + `/list/?page=${this.pageTareas}`;

      return this.http.get(url, { headers })
        .pipe(map((resp: any) => {
          this.dataLocalService.guardarTareas(resp.tareas);
          return resp;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }

}

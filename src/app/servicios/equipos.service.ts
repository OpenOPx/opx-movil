import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { map, catchError } from 'rxjs/operators';

const URL = environment.API_URL + '/equipos';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private errorService: ErrorService,
  ) { }

  /**
   * @description Lista de equipos por proyecto
   * @param proyid Id del proyecto
   */
  equiposPorProyecto(proyid: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });

    return this.http.get(`${URL}/list/${proyid}`, { headers })
      .pipe(map((resp: any) => {
        return resp.equipo;
      }), catchError(e => this.errorService.handleError(e)));
  }

  /**
   * @description Lista los usuarios disponibles por proyecto
   * @param proyid Identificador del proyecto
   */
  usuariosDisponibles(proyid: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.get(`${URL}/${proyid}/equipos-disponibles/`, { headers })
      .pipe(map((resp: any) => {
        return resp.equipo;
      }), catchError(e => this.errorService.handleError(e)));
  }

  /**
   * @description Método que se encarga de asignar un usuario a un proyecto
   * Solo realizado por Proyectista
   */
  agregarEquipoProyecto(proyectoId: string, equipoId: string) {

    const headers = new HttpHeaders({
      Authorization: this.authService.token,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const querystring = this.authService.querystring({ equipoId, proyectoId });
    return this.http.post(`${URL}/store/`, querystring, { headers })
      .pipe(catchError(e => this.errorService.handleError(e)));
  }

  /**
   * @description Elimina un usuario de proyecto
   */
  eliminarEquipoProyecto(equid: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.delete(`${URL}/delete/${equid}`, { headers })
      .pipe(catchError(e => this.errorService.handleError(e)));
  }
}

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
   * Lista de equipos por proyecto
   * @param proyid Id del proyecto
   */
  equiposPorProyecto(proyid: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });

    return this.http.get(`${URL}/list/${proyid}`, { headers })
      .pipe(map((resp: any) => {
        console.log("Respuesta del listado de equipos asociados al proyecto")
        console.log(resp)
        return resp.equipo;
        //BEYCKER REVISAR
        //Creo que retorna el equipo, es decir, todos los usarios del Proyecto cuyo ID sea el que se le pasa por parametro
        //Decirle a Leonanardo que pruebe que retorna esta peticion
      }), catchError(e => this.errorService.handleError(e)));
  }

  /**
   * Lista los usuarios disponibles por proyecto
   * @param proyid Identificador del proyecto
   */
  usuariosDisponibles(proyid: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.get(`${URL}/${proyid}/equipos-disponibles/`, { headers })
      .pipe(map((resp: any) => {
        //BEYCKER REVISAR - Que devuelve esto? Usuarios que atributos tiene
        //Preguntarle a Leonardo que me devuelve esta peticion
        console.log("Respuesta del listado de equipos que pueden ser asociados al proyecto")
        console.log(resp)
        return resp.equipo;
      }), catchError(e => this.errorService.handleError(e)));
  }

  /**
   * Método que se encarga de asignar un usuario a un proyecto
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
   * Elimina un usuario de proyecto
   */
  eliminarEquipoProyecto(equid: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.delete(`${URL}/delete/${equid}`, { headers })
      .pipe(catchError(e => this.errorService.handleError(e)));
  }
}

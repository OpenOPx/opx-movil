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
   * @description Obtiene información detallada de un usuario a partir del id suministrado
   * @param id id del usuario
   */
  detalleUsuario(id: string) {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.usuario());
    } else {
      const headers = new HttpHeaders({ Authorization: this.authService.token });
      return this.http.get(`${URL}/detail/${id}`, { headers })
        .pipe(map((resp: any) => {
          //BEYCKER REVISAR. Se cambio resp.usuario.rol por resp.usuario.role_name y getUser().role_name 
          if (this.authService.getUser().role_name !== resp.usuario.role_name) {
            this.authService.logout();
          }
          this.dataLocalService.usuario(resp.usuario);
          return resp.usuario;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }

  /**
   * @description Actualiza la información de un usuario mediante una petición http.post. Además almacena el nuevo usario en el Storage local
   * @param usuario Usuario enviado desde el perfil.page.ts
   * SOLO ONLINE
   */
  editarUsuario(usuario: User) {
    const headers = new HttpHeaders({
      Authorization: this.authService.token,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const querystring = this.authService.querystring(usuario);
    return this.http.post(`${URL}/${this.authService.user.pers_id}`, querystring, { headers })
      .pipe(map(async (resp: any) => {
        let user = this.authService.getUser();
        //BEYCKER REVISAR PRIORIDAD; esta linea aparecia antes y se cambio por las dos siguientes: user.userfullname = resp.usuario.fields.userfullname;
        //Quizas no fields no retorne pers_name y pers_lastname
        user.userfullname = resp.usuario.fields.pers_name + ' ' + resp.usuario.fields.pers_lastname;
        //user.pers_name = resp.usuario.fields.pers_name;
        //user.pers_lastname = resp.usuario.fields.pers_lastname;
        this.authService.saveUser(user);
      }), catchError(e => this.errorService.handleError(e)));
  }
}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/user';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: string = null;
  public user: User;

  /**
   * Servicio que representa el registro, login de la aplicación movil.
   */
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private navCtrl: NavController
  ) { }

  /**
   * Requerido para enviar objetos en el body de una petición HTTP
   */
  querystring(obj: object): string {
    return Object.keys(obj)
      .map(key => {
        return key + '=' + obj[key];
      }).join('&');
  }

  /**
   * Autenticación de la plataforma
   * @param email correo del usuario
   * @param password contraseña del usuario
   */
  login(email: string, password: string) {

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const querystring = this.querystring({ username: email, password });

    return this.http.post(URL + '/login/', querystring, { headers })
      .pipe(map(async (resp: any) => {
        await this.removeItems();
        await this.saveToken(resp.token);
        resp.user.password = password;
        await this.saveUser(resp.user);
      }), catchError(this.handleError));
  }

  removeItems() {
    return Promise.all([
      this.storage.remove('tareas'),
      this.storage.remove('proyectos'),
      this.storage.remove('usuario'),
      this.storage.remove('proyectos-detalle')
    ]);
  }

  /**
   * Registro de usuarios en la plataforma
   * Por defecto los usuarios registrados tienen el rol de Voluntario
   */
  registro(form: any) {

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const querystring = this.querystring(form);

    return this.http.post(URL + '/usuarios/store/', querystring, { headers })
      .pipe(catchError(this.handleError));

  }

  /**
   * Cierra sesión en la aplicación móvil.
   * Se eliminan toda la información almaceneda en la memorial local y/o nativa.
   */
  logout() {
    this.token = null;
    this.user = null;
    this.storage.clear();
    this.navCtrl.navigateRoot('/');
  }

  /**
   * Obtiene el usuario actual
   * En caso de no tenerlo, se redirige a la página principal
   */
  getUser() {
    if (!this.user.userid) {
      this.checkToken();
    }
    return { ...this.user };
  }

  /**
   * Guarda el token en el almacenamiento local del dispositivo móvil.
   */
  async saveToken(token: string) {
    this.token = 'Bearer ' + token;
    await this.storage.set('token', this.token);
    await this.checkToken();
  }

  /**
   * Guarda usuario en el almacenamiento local del dispositivo móvil.
   */
  async saveUser(user: User) {
    this.user = user;
    await this.storage.set('user', user);
    await this.checkToken();
  }

  /**
   * Carga el token del almacenamiento local del dispositivo móvil.
   * En caso de no tener, retorna null.
   */
  async loadToken() {
    this.token = await this.storage.get('token') || null;
    this.user = await this.storage.get('user') || null;
  }

  /**
   * Verifica que el token exista en el almacenamiento local del dispositivo móvil.
   */
  async checkToken(): Promise<boolean> {
    await this.loadToken();
    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }


  /**
   * Handles error
   * @param error type `HttpErrorResponse`
   * @returns throwError
   */
  private handleError(error: HttpErrorResponse) {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.log(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error.message}`);
    console.log(error);
    // return an observable with a user-facing error message
    return throwError(error.error);
  }
}

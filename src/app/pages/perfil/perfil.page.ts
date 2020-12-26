import { NetworkService, ConnectionStatus } from 'src/app/servicios/network.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AuthService } from 'src/app/servicios/auth.service';
import { ModalLoginComponent } from 'src/app/componentes/auth/modal-login/modal-login.component';
import { UtilidadesService } from 'src/app/servicios/utilidades.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { User } from 'src/app/interfaces/user';
import { UiService } from 'src/app/servicios/ui.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { environment } from 'src/environments/environment';

const URL = environment.API_URL;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  profileEdit = false;
  profileIcon = 'create';

  loading = true;

  loader;

  generos: any = [];
  nivelesEducativos: any = [];
  barrios: any = [];

  usuario: any = {};
  name = '';

  constructor(
    private utilidadesService: UtilidadesService,
    private usuarioService: UsuarioService,
    private networkService: NetworkService,
    private modalCtrl: ModalController,
    public authService: AuthService,
    private uiService: UiService,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
    this.cargarUtilidades();
  }

  /**
   * @description verifica si el el token corresponde al de un usuario para mostrar su información, si el token es null, despliega el modal de login de usuario
   */
  async ionViewDidEnter() {
    if (!this.authService.token) {
      const modal = await this.modalCtrl.create({
        component: ModalLoginComponent
      });
      modal.present();
    } else {
      this.detalleUsuario();
    }
  }

  /**
   * @description Hace uso del servicio detalleUsuario para almacenar en las variables definidas en esta page la información del usuario
   * loading = false para que se muestre la información de usuario en la interfaz gráfica HTML
   */
  detalleUsuario() {
    //BEYCKER REVISAR pers_id o userid
    this.usuarioService.detalleUsuario(this.authService.user.pers_id)
      .subscribe((u: User) => {
        this.usuario = u;
        //BEYCKER REVISAR, antes estaba como: this.name = u.userfullname;
        this.name = u.pers_name + ' ' + u.pers_lastname;
        this.loading = false;
      });
  }

  /**
   * @description Carga el listado de generos, niveles educativos y barrios del servidor (en caso de estar online) o del listado local del storage, y los asigna a los atributos generos, nivelesEducativos y barrios
   */
  cargarUtilidades() {
    Promise.all([
      this.utilidadesService.listaGeneros().toPromise(),
      this.utilidadesService.listaNivelesEducativos().toPromise(),
      this.utilidadesService.listaBarrios().toPromise()
    ]).then(values => {
      this.generos = values[0];
      this.nivelesEducativos = values[1];
      this.barrios = values[2];
    });
  }

  cerrarSesion() {
    this.authService.logout();
  }

  /**
   * @description Hace un cambio de valor de la variable profileEdit (De true a False o Viceversa) y cambia el icono de creación y guardar
   * Cuando se le da click para grabar los cambios profileEdit = false y llama el método guardarUsuario()
   */
  hideShowEdit() {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      this.uiService.presentToast('Función disponible solo online');
      return;
    }

    this.profileEdit = !this.profileEdit;
    this.profileIcon = this.profileIcon === 'create' ? 'save' : 'create';

    if (!this.profileEdit) {
      this.guardarUsuario();
    }

  }

  /**
   * @description Toma los nuevos valores de los campos y los envia al servicio editarUsuario de usuarioService
   */
  async guardarUsuario() {

    this.loader = await this.uiService.presentLoading('Guardando...');

    const date = new Date(this.usuario.pers_birthdate);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();

    const usuario = {
      useremail: this.usuario.useremail,
      password: this.authService.user.password,
      //BEYCKER REVISAR, aqui antes aparecia this.usuario.rolid
      role_id: this.usuario.role_id,
      pers_name: this.usuario.pers_name,
      pers_lastname: this.usuario.pers_lastname,
      pers_birthdate: `${year}-${month}-${day}`,
      gender_id: this.usuario.gender_id,
      neighborhood_id: this.usuario.neighborhood_id,
      pers_telephone: this.usuario.pers_telephone,
      education_level_id: this.usuario.education_level_id
    };

    this.usuarioService.editarUsuario(usuario)
      .subscribe(() => {
        this.name = this.usuario.pers_name + ' ' + this.usuario.pers_lastname;
        this.uiService.presentToastSucess('Actualizado correctamente.');
        this.loader.dismiss();
      }, (error => {
        this.loader.dismiss();
        this.uiService.presentToastError('Ha ocurrido un error. Por favor intenta de nuevo!');
        console.log('error', error);
      }));
  }

  abrirLink() {
    this.iab.create(`${URL}`, '_system');
  }

}

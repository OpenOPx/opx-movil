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

  detalleUsuario() {
    this.usuarioService.detalleUsuario(this.authService.user.userid)
      .subscribe((u: User) => {
        this.usuario = u;
        this.name = u.userfullname;
        this.loading = false;
      });
  }

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

  async guardarUsuario() {

    this.loader = await this.uiService.presentLoading('Guardando...');

    const date = new Date(this.usuario.fecha_nacimiento);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();

    const usuario = {
      useremail: this.usuario.useremail,
      password: this.authService.user.password,
      rolid: this.usuario.rolid,
      userfullname: this.usuario.userfullname,
      fecha_nacimiento: `${year}-${month}-${day}`,
      generoid: this.usuario.generoid,
      barrioid: this.usuario.barrioid,
      telefono: this.usuario.telefono,
      nivel_educativo_id: this.usuario.nivel_educativo_id
    };

    this.usuarioService.editarUsuario(usuario)
      .subscribe(() => {
        this.name = this.usuario.userfullname;
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

import { ModalController, NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from 'src/app/servicios/auth.service';
import { UiService } from 'src/app/servicios/ui.service';
import { ModalRegistroComponent } from '../modal-registro/modal-registro.component';
import { environment } from 'src/environments/environment';

const URL = environment.API_URL;

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.scss'],
})
export class ModalLoginComponent implements OnInit {

  loading;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private uiService: UiService,
    private iab: InAppBrowser
  ) { }

  ngOnInit() { }

  /**
   * 
   * @param form formulario con los campos de este en el html
   * @description valida los datos usuario y contraseña para ingresar o rechazar en caso de incosistencia
   */
  async login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.loading = await this.uiService.presentLoading('Ingresando...');

    this.authService.login(form.value.email, form.value.password)
      .subscribe(async () => {
        await this.loading.dismiss();
        this.cerrar();
      }, async (error: any) => {
        await this.loading.dismiss();
        if (error.code === 404) {
          this.uiService.presentToastError(error.message);
        } else {
          this.uiService.presentToastError('Ha ocurrido un error. Por favor intenta de nuevo!');
        }
      });
  }

  /**
   * @description redirecciona al sitio para resetear la contraseña
   */
  abrirLink() {
    this.iab.create(`${URL}/auth/password-reset/`, '_system');
  }

  cerrar() {
    this.navCtrl.navigateForward('/');
    this.modalCtrl.dismiss();
  }

  /**
   * @description redirecciona al sitio para registrar nuevo usuario
   */
  async mostrarModalRegistro() {
    this.cerrar();
    const modalR = await this.modalCtrl.create({
      component: ModalRegistroComponent
    });
    modalR.present();
  }

}

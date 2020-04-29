import { ModalController, IonSlides, IonInput } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { UiService } from 'src/app/servicios/ui.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { UtilidadesService } from 'src/app/servicios/utilidades.service';

// ID para el rol del voluntario
const ROLID = '0be58d4e-6735-481a-8740-739a73c3be86';

@Component({
  selector: 'app-modal-registro',
  templateUrl: './modal-registro.component.html',
  styleUrls: ['./modal-registro.component.scss'],
})
export class ModalRegistroComponent implements OnInit {

  passwordType = 'password';
  passwordIcon = 'eye-off';

  loading;

  slideActiveIndex = 0;

  generos: any = [];
  nivelesEducativos: any = [];
  barrios: any = [];

  nuevoUsuario: any = {};

  @ViewChild('slidePrincipal', { static: true }) slides: IonSlides;
  @ViewChild('inputEmail', { static: true }) inputEmail: IonInput;

  constructor(
    private utilidadesService: UtilidadesService,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.cargarUtilidades();
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

  async ionViewDidEnter() {
    this.slides.lockSwipes(true);
    this.slides.options.scrollbar = false;
  }

  async registro() {

    this.loading = await this.uiService.presentLoading('Registrando...');

    const date = new Date(this.nuevoUsuario.fecha_nacimiento);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();

    const form = {
      useremail: this.nuevoUsuario.useremail,
      password: this.nuevoUsuario.userpassword,
      rolid: ROLID,
      fecha_nacimiento: `${year}-${month}-${day}`,
      generoid: this.nuevoUsuario.genero,
      userfullname: `${this.nuevoUsuario.nombre} ${this.nuevoUsuario.apellido}`,
      barrioid: this.nuevoUsuario.barrio,
      nivel_educativo_id: this.nuevoUsuario.niveleducativo,
      telefono: this.nuevoUsuario.telefono
    };

    this.authService.registro(form)
      .subscribe(async () => {

        await this.loading.dismiss();
        this.uiService.presentToastSucess('Registrado correctamente.');

        this.cerrar();
        const modal = await this.modalCtrl.create({
          component: ModalLoginComponent
        });
        modal.present();

      }, async (error: any) => {
        await this.loading.dismiss();
        if (error.code === 400) {
          this.uiService.presentToastError('Verifique su correo.');

          this.slides.lockSwipes(false);
          this.slides.slideTo(3);
          this.slides.lockSwipes(true);

          setTimeout(() => {
            this.inputEmail.setFocus();
          }, 500);

        } else {
          this.uiService.presentToastError('Ha ocurrido un error. Por favor intenta de nuevo!');
          this.cerrar();
        }
      });
    this.loading.dismiss();
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  async mostrarModalLogin() {
    this.cerrar();
    const modalR = await this.modalCtrl.create({
      component: ModalLoginComponent
    });
    modalR.present();
  }

  async siguiente() {
    this.slides.lockSwipes(false);
    const from = await this.slides.getActiveIndex();
    const total = (await this.slides.length() - 1);

    if (from !== total) {
      this.slides.slideTo(from + 1);
    }
    this.slideActiveIndex = await this.slides.getActiveIndex();
    this.slides.lockSwipes(true);
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

}

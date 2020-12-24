import { ModalController, IonSlides, IonInput } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { UiService } from 'src/app/servicios/ui.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { FcmService } from 'src/app/servicios/fcm.service';
import { DataLocalService } from 'src/app/servicios/data-local.service';
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
    private uiService: UiService,
    private fcmService: FcmService,
    private datalocalservice: DataLocalService
  ) { }

  ngOnInit() {
    this.cargarUtilidades();
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

  async ionViewDidEnter() {
    this.slides.lockSwipes(true);
    this.slides.options.scrollbar = false;
  }

  /**
   * @description prepara los campos del formulario para ser enviados al método registro() en el servicio authService
   * @throws error si el correo está incorrecto
   */
  async registro() {

    this.fcmService.initPush();
    this.loading = await this.uiService.presentLoading('Registrando...');

    const tokenmovil = this.datalocalservice.obtenerTokenMovil();
    const date = new Date(this.nuevoUsuario.fecha_nacimiento);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();

    //BEYCKER: Revisar si estos son los nombres de atributos correctos
    const form = {
      useremail: this.nuevoUsuario.useremail,
      password: this.nuevoUsuario.userpassword,
      role_id: ROLID,
      pers_birthdate: `${year}-${month}-${day}`,
      gender_id: this.nuevoUsuario.genero,
      //userfullname: `${this.nuevoUsuario.nombre} ${this.nuevoUsuario.apellido}`,
      pers_name: this.nuevoUsuario.nombre,
      pers_lastname: this.nuevoUsuario.apellido,
      neighborhood_id: this.nuevoUsuario.barrio,
      education_level_id: this.nuevoUsuario.niveleducativo,
      pers_telephone: this.nuevoUsuario.telefono,
      fcm_token: tokenmovil
      //Se agrego el nuevo atributo tokenmovil, se debe agregar como un nuevo atributo en el modelo de base de datos y quizas en la nterface user
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

  /**
   * @description Descarta o cierra el modal actual
   */
  cerrar() {
    this.modalCtrl.dismiss();
  }

  /**
   * @description Cambia la vista para desplegar el Modal del Login
   */
  async mostrarModalLogin() {
    this.cerrar();
    const modalR = await this.modalCtrl.create({
      component: ModalLoginComponent
    });
    modalR.present();
  }

  /**
   * @description Cambia la vista de registro actual para pedir los siguientes datos de registro al usuario.
   */
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

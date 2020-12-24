import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  /**
   * Servicio que centraliza y controla los mensajes emergentes de la aplicación móvil
   */
  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  /**
   * @description Muestra un mensaje en formato de alerta informativa con un botón de OK
   * @param message Texto a mostrar en el recuadro
   */
  async informativeAlert(message: string) {
    const alert = await this.alertController.create({
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  /**
   * @description Muestra un mensaje en formato Toast flotante
   * @param message Texto a mostrar en el Toast
   */
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      position: 'top',
      duration: 2500
    });
    toast.present();
  }

  /**
   * @description Muestra un mensaje de exito en formato Toast flotante
   * @param message Texto a mostrar en el Toast
   */
  async presentToastSucess(message: string) {
    const toast = await this.toastController.create({
      message,
      position: 'top',
      color: 'success',
      duration: 2000
    });
    toast.present();
  }

  /**
   * @description Muestra un mensaje de error en formato Toast flotante
   * @param message Texto a mostrar en el Toast
   */
  async presentToastError(message: string) {
    const toast = await this.toastController.create({
      message,
      color: 'danger',
      position: 'top',
      duration: 2000,
    });
    toast.present();
  }

  /**
   * @param message mensaje para mostrar en la carga
   * @description presenta un mensaje mientras la vista de la interfaz gráfica carga
   */
  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message
    });
    await loading.present();
    return loading;
  }
}

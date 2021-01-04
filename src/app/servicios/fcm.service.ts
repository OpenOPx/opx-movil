import { Injectable } from '@angular/core';
import { DataLocalService } from './data-local.service';
import { NavController } from '@ionic/angular';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor
} from '@capacitor/core';
//import { Router } from '@angular/router';
 
const { PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  tokenbey;

  constructor(
    //private router: Router,
    private navCtrl: NavController,
    private datalocalservice: DataLocalService
    ) { }

  public initPush() {
    if (Capacitor.platform !== 'web') {
      console.log('entro al initPush')
      //this.token = 'Entro al if'
      this.registerPush();
    }
    console.log('no entro al initPush')
  }

  getToken(){
    return this.tokenbey;
  }

  private registerPush() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then((permission) => {
      if (permission.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // No permission for push granted
      }
    });
 
    // On success, we should be able to receive notifications
    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {
        //El metodo guardarTokenMovil puede presentar algun inconveniente ya que retorna una promesa, tal vez hay que dejar ese metodo sin el async
        this.datalocalservice.guardarTokenMovil(token.value);
        this.tokenbey = token.value;
        console.log('My token: ' + JSON.stringify(token));
        this.datalocalservice.obtenerTokenMovil().then(resp => {
          console.log('token guardado en datalocal' + resp)
        })
        //alert('Push registration success, token: ' + token.value);
        //El método JSON.stringify() convierte un objeto o valor de JavaScript en una cadena de texto JSON
      }
    );
 
    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });
 
    // Show us the notification payload if the app is open on our device
    //Esto se activa cuando llega una nueva notificacion
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );
 
    // Method called when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        console.log(notification);
        this.navCtrl.navigateForward(`/tabs/notificaciones`);
        /*
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if (data.detailsId) {
          this.router.navigateByUrl(`/home/${data.detailsId}`);
        }
        */
      }
    );
  }
}

import { Component } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { timer } from 'rxjs';
import { AuthService } from './servicios/auth.service';
import { ModalAuthComponent } from './componentes/auth/modal-auth/modal-auth.component';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `<div *ngIf="showSplash" class="splash"> <div class="spinner"><ion-img src="assets/icon/logo-splash.png"></ion-img></div> </div>
    <ion-app><ion-router-outlet></ion-router-outlet></ion-app>`
})
export class AppComponent {

  showSplash = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private modalCtrl: ModalController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.authService.loadToken();
      timer(3000).subscribe(async () => {
        this.showSplash = false;
        if (!this.authService.token) {
          const modal = await this.modalCtrl.create({
            component: ModalAuthComponent
          });
          modal.present();
        }
      });
    });
  }
}

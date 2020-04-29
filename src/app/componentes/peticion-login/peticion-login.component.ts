import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ModalLoginComponent } from '../auth/modal-login/modal-login.component';
import { ModalRegistroComponent } from '../auth/modal-registro/modal-registro.component';

@Component({
  selector: 'app-peticion-login',
  templateUrl: './peticion-login.component.html',
  styleUrls: ['./peticion-login.component.scss'],
})
export class PeticionLoginComponent implements OnInit {

  @Input() pantalla = '';
  @Input() mensaje = '';
  @Input() back = false;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) { }

  ngOnInit() { }

  async mostrarModal(component: string) {
    switch (component) {
      case 'login':
        const modal = await this.modalCtrl.create({
          component: ModalLoginComponent
        });
        modal.present();
        break;
      case 'registro':
        const modalR = await this.modalCtrl.create({
          component: ModalRegistroComponent
        });
        modalR.present();
        break;
    }

    // Usado para salir del componente de Proyectos y no cargue los mismos que están antes de loguearse
    if (this.back) {
      this.navCtrl.back();
    }
  }


}

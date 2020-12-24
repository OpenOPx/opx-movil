import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { ModalRegistroComponent } from '../modal-registro/modal-registro.component';

@Component({
  selector: 'app-modal-auth',
  templateUrl: './modal-auth.component.html',
  styleUrls: ['./modal-auth.component.scss'],
})
export class ModalAuthComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  /**
   * 
   * @param component login o registro. Depende del botón selecionado por el usuario
   * @description Redirecciona a la vista de registro o login
   */
  async mostrarModal(component: string) {
    this.cerrar();
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
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

}

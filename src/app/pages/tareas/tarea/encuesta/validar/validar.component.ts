import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IonSlides, ModalController, AlertController } from '@ionic/angular';

import { InstrumentosService } from 'src/app/servicios/instrumentos.service';
import { UiService } from 'src/app/servicios/ui.service';

@Component({
  selector: 'app-validar',
  templateUrl: './validar.component.html',
  styleUrls: ['./validar.component.scss'],
})
export class ValidarComponent implements OnInit {

  @Input() encuestas: any[];
  @ViewChild('slidePrincipal', { static: true }) slides: IonSlides;

  loading: any;

  slideActiveIndex = 0;
  slideLength = 0;

  constructor(
    private modalCtrl: ModalController,
    public alertController: AlertController,
    private instrumentosServices: InstrumentosService,
    private uiService: UiService
  ) { }

  ngOnInit() { }

  async ionViewDidEnter() {
    this.slideLength = await this.slides.length();
    // this.slides.lockSwipes(true);
  }

  async validar() {
    const from = await this.slides.getActiveIndex();
    const encuesta = this.encuestas[from];

    this.loading = await this.uiService.presentLoading('');

    this.instrumentosServices.revisionEncuesta(encuesta.encuestaid, 2)
      .subscribe(async () => {
        this.encuestas[from].estado = 2;
        await this.loading.dismiss();
        await this.uiService.presentToastSucess('Validada correctamente.');
        await this.siguiente();
      }, async (err) => {
        await this.loading.dismiss();
        this.uiService.presentToastError('Error al validar.');
        console.log(err);
      });

  }

  async invalidar() {
    await this.presentAlertPrompt();
  }

  async anterior() {
    // this.slides.lockSwipes(false);
    const from = await this.slides.getActiveIndex();

    if (from === 0) {
      this.slides.slideTo(0);
    } else {
      this.slides.slideTo(from - 1);
    }

    this.slideActiveIndex = await this.slides.getActiveIndex();
    // this.slides.lockSwipes(true);
  }

  async siguiente() {
    // this.slides.lockSwipes(false);
    const from = await this.slides.getActiveIndex();
    const total = (await this.slides.length() - 1);

    if (from !== total) {
      this.slides.slideTo(from + 1);
    }
    this.slideActiveIndex = await this.slides.getActiveIndex();
    //  this.slides.lockSwipes(true);
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Observación',
      inputs: [
        {
          name: 'obs',
          type: 'text',
          placeholder: 'Escribe aquí'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Aceptar',
          handler: async (e) => {
            const from = await this.slides.getActiveIndex();
            const encuesta = this.encuestas[from];

            this.loading = await this.uiService.presentLoading('');

            this.instrumentosServices.revisionEncuesta(encuesta.encuestaid, 1, e.obs)
              .subscribe(async () => {
                this.encuestas[from].estado = 1;
                this.encuestas[from].observacion = e.obs;
                await this.loading.dismiss();
                await this.uiService.presentToastSucess('Invalidada correctamente.');
                await this.siguiente();
              }, async (err) => {
                await this.loading.dismiss();
                this.uiService.presentToastError('Error al invalidar.');
                console.log(err);
              });
          }
        }
      ]
    });

    await alert.present();
  }

  async slideChange(e) {
    this.slideActiveIndex = await this.slides.getActiveIndex();
  }

  getColor(estado: number) {
    if (estado === 0) {
      return 'medium';
    } else if (estado === 2) {
      return 'success';
    } else if (estado === 1) {
      return 'danger';
    }
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}

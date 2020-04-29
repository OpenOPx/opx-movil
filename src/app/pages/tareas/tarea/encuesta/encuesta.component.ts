import { Component, OnInit, Input } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { InstrumentosService } from 'src/app/servicios/instrumentos.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss'],
})
export class EncuestaComponent implements OnInit {

  @Input() id: string;
  loading = true;

  url: string;

  constructor(
    private modalCtrl: ModalController,
    private instrumentosServices: InstrumentosService) { }

  ngOnInit() {
    this.instrumentosServices.enlaceFormularioKoboToolbox(this.id)
      .subscribe(enlace => {
        this.url = enlace;
        this.loading = false;
      });
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { InstrumentosService } from 'src/app/servicios/instrumentos.service';
import { DataLocalService } from 'src/app/servicios/data-local.service';

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
    private instrumentosServices: InstrumentosService,
    private datalocalservice: DataLocalService) { }

  ngOnInit() {
    this.instrumentosServices.enlaceFormularioKoboToolbox(this.id)
      .subscribe(enlace => {
        this.url = enlace;
        this.loading = false;
      });
  }

  regresar() {
    this.modalCtrl.dismiss();
    console.log('Se activa al hacer x')
    this.datalocalservice.obtenerCantidadActualEncuestas().then(resp => {
      let cantactual = resp;
      this.instrumentosServices.obtenerCantidadRespuestaFormularios(this.id).subscribe(respn => {
        let cantdespues = respn;
        console.log('Cantidad Antes: ' + cantactual);
        console.log('Cantidad Despues: ' + cantdespues);
        if(cantactual < cantdespues){
          console.log('Entro al if')
          this.instrumentosServices.almacenarEncuesta(this.id).subscribe(respsuscribe => {
            console.log(respsuscribe)
          })
        }
      })
    })
    
  }

}

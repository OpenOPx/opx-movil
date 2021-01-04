import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { EncuestaComponent } from './encuesta/encuesta.component';
import { ActivatedRoute } from '@angular/router';
import { TareasService } from 'src/app/servicios/tareas.service';
import { Tarea } from 'src/app/interfaces/tarea';

import { Map, tileLayer, geoJSON, marker, latLng } from 'leaflet';
import { InstrumentosService } from 'src/app/servicios/instrumentos.service';
import { MapeoComponent } from './mapeo/mapeo.component';
import { ValidarComponent } from './encuesta/validar/validar.component';
import { AuthService } from 'src/app/servicios/auth.service';
import { UbicacionService } from 'src/app/servicios/ubicacion.service';
import { ProyectosService } from 'src/app/servicios/proyectos.service';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.page.html',
  styleUrls: ['./tarea.page.scss'],
})
export class TareaPage implements OnInit {

  @Input() id;
  @ViewChild('mapa', { static: true }) mapa;
  tarea: Tarea;

  cargando = true;
  implementado = false;

  cargandogeojs = true;

  map: Map;
  geoJS: any;
  marker: marker;

  geojscontent: any;  

  constructor(
    private instrumentosServices: InstrumentosService,
    private ubicacionService: UbicacionService,
    public alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private tareasService: TareasService,
    private modalCtrl: ModalController,
    public authService: AuthService,
    public navCtrl: NavController,
    public proyectoService: ProyectosService
  ) { }

  ngOnInit() {
    this.ubicacionService.obtenerUbicacionActual();
  }

  async ionViewDidEnter() {

    this.map = new Map(this.mapa.nativeElement).setView([3.4376309, -76.5429797], 12);

    tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}').addTo(this.map);

    tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wms?service=WMS', {
      layers: 'idesc:mc_barrios',
      format: 'image/png',
      transparent: !0,
      version: '1.1.0'
    }).addTo(this.map);

    this.activatedRoute.params.subscribe(params => this.detalleTarea(params.id));
    this.actualizaUbicacion();
  }

  detalleTarea(id: string) {
    this.tareasService.detalleTarea(id)
      .subscribe(async resp => {
        if (resp) {
          this.cargando = false;
          this.tarea = resp;
          this.tarea.task_id = id;
          console.log(this.tarea)
          if (this.tarea.task_type === 1) {
            const res = await this.instrumentosServices.verificarImplementacion(this.tarea.instrument);
            this.implementado = res;

            // Instrucción realizada con el fin de almacenar anticipadamente en localStorage, la URL.
            this.instrumentosServices.enlaceFormularioKoboToolbox(this.tarea.task_id).subscribe();
          } else {
            // Instrucción realizada con el fin de almacenar anticipadamente en localStorage, la URL.
            this.instrumentosServices.detalleMapeo(this.tarea.task_id).subscribe();
          }

          this.proyectoService.detalleProyecto(this.tarea.project).subscribe(resp => {
            var cosatemp = resp.tareas.find(element => element.task_id === this.tarea.task_id);
            console.log(cosatemp)
            this.geojscontent = cosatemp.dimension_geojson
            console.log(this.geojscontent)
            this.geoJS = geoJSON(JSON.parse(this.geojscontent)).addTo(this.map);
            this.map.fitBounds(this.geoJS.getBounds());
            this.cargandogeojs = false;
          })
          
        } else {
          this.tarea = undefined;
          this.navCtrl.back();
        }
      });
  }

  actualizaUbicacion() {
    return this.ubicacionService.obtenerUbicacionActual()
      .then(async () => {

        const lat = this.ubicacionService.ubicacionActual.latitude;
        const long = this.ubicacionService.ubicacionActual.longitude;

        if (this.marker) {
          this.map.removeLayer(this.marker);
          const latlng = latLng(lat, long);
          this.marker.setLatLng(latlng)
            .addTo(this.map)
            .bindPopup('Ubicación actual.');
        } else {
          this.marker = marker([lat, long])
            .addTo(this.map)
            .bindPopup('Ubicación actual.');
        }

        if (this.geoJS) {
          const res = this.ubicacionService.obtenerPoligono(this.geoJS);
          if (res.length) {
            const properties = res[0].feature.properties;
            // this.poligonoSeleccionado = properties;
          } else {
            // this.poligonoSeleccionado = undefined;
          }
        }
      });
  }

  async encuesta() {
    if (!this.ubicacionService.obtenerPoligono(this.geoJS).length) {
      await this.presentAlert();
      return;
    }

    const modal = await this.modalCtrl.create({
      component: EncuestaComponent,
      componentProps: {
        id: this.tarea.task_id,
      }
    });
    modal.present();
  }

  async mapeo() {
    if (!this.ubicacionService.obtenerPoligono(this.geoJS).length) {
      await this.presentAlert();
      return;
    }
    const modal = await this.modalCtrl.create({
      component: MapeoComponent,
      componentProps: {
        tarea: this.tarea
      }
    });
    modal.present();
  }

  validar() {
    this.instrumentosServices.informacionInstrumento(this.tarea.task_id)
      .subscribe(async r => {
        console.log('R: ' + JSON.stringify(r))
        if (this.tarea.task_type === 1) {
          const filter = [];
          r.campos.filter(c => c.type !== 'start' && c.type !== 'end')
            .forEach(element => {
              filter.push({
                item: element.$autoname,
                label: element.label[0]
              });
            });
          console.log('filter: '+ JSON.stringify(filter))
          const encuestas = [];
          r.info.forEach(data => {
            //BEYCKER REVISAR. Estos atributos estan en el back en views.py def informacionInstrumento(request, id): y los deje igual
            const tmp = {
              encuestaid: data.encuestaid,
              estado: data.estado,
              observacion: data.observacion,
              formulario: []
            };
            //BEYCKER REVISAR. Esta parte del label y respuesta tampoco la toqué
            filter.forEach(pregunta => {
              tmp.formulario.push({
                label: pregunta.label,
                respuesta: data[pregunta.item]
              });
            });

            encuestas.push(tmp);
          });
          
          const modal = await this.modalCtrl.create({
            component: ValidarComponent,
            componentProps: {
              encuestas
            }
          });
          await modal.present();
        } else if (this.tarea.task_type === 2) {
          const modal = await this.modalCtrl.create({
            component: MapeoComponent,
            componentProps: {
              validar: true,
              tarea: this.tarea
            }
          });
          await modal.present();
        }
      });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Lo sentimos',
      message: 'Para continuar debes encontrarte dentro del territorio de la tarea.',
      buttons: ['OK']
    });

    await alert.present();
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}

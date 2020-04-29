import { Component, OnInit } from '@angular/core';
import { Map, tileLayer, marker, geoJSON } from 'leaflet';
import { ProyectosService } from 'src/app/servicios/proyectos.service';
import { Proyecto } from 'src/app/interfaces/proyecto';
import { UiService } from 'src/app/servicios/ui.service';
import { PickerController, NavController, AlertController } from '@ionic/angular';
import { TareasService } from 'src/app/servicios/tareas.service';
import { NetworkService, ConnectionStatus } from 'src/app/servicios/network.service';

@Component({
  selector: 'app-proyectista',
  templateUrl: './proyectista.page.html',
  styleUrls: ['./proyectista.page.scss'],
})
export class ProyectistaPage implements OnInit {

  loading = false;

  proyectos: Proyecto[] = [];
  proyectoSeleccionado: Proyecto = {};

  territorioSeleccionado: any = {};
  nombreSeleccionado = '';
  tareaSeleccionada = false;

  map: Map;
  geoJSONDimensiones: any;
  geoJSONTareas: any;
  marker: marker;

  constructor(
    private proyectosService: ProyectosService,
    public pickerController: PickerController,
    public alertController: AlertController,
    private networkService: NetworkService,
    private tareaService: TareasService,
    private navCtrl: NavController,
    private uiService: UiService,
  ) {
    proyectosService.pageProyectos = 0;
  }

  ngOnInit() {
    this.cargarProyectos();
  }

  ionViewDidEnter() {
    this.leafletMap();
    if (this.territorioSeleccionado.proyid) {
      this.detalleProyecto(this.proyectoSeleccionado.proyid);
    }
  }

  cargarProyectos() {
    this.proyectosService.listadoProyectos()
      .subscribe(resp => {
        this.proyectos.push(...resp.proyectos);
        if (resp.paginator.currentPage !== resp.paginator.lastPage) {
          this.cargarProyectos();
        } else {
          this.loading = false;
        }
      }, (e => {
        this.loading = false;
        this.uiService.presentToastError(e.message);
      }));
  }

  detalleProyecto(id: string) {

    this.proyectosService.dimensionesTerritoriales(id)
      .subscribe(p => {
        const gjLayer = [];
        p.forEach(element => {
          const geoJS = JSON.parse(element.geojson);
          delete element.geojson;
          geoJS.properties = element;
          gjLayer.push(geoJS);
        });

        this.geoJSONDimensiones = geoJSON(gjLayer, {
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.nombre) {
              layer.bindPopup(feature.properties.nombre);
            }
            layer.on({
              click: () => {
                this.nombreSeleccionado = feature.properties.nombre;
                this.territorioSeleccionado = feature.properties;
                this.tareaSeleccionada = false;
              }
            });
          }
        }).addTo(this.map);
        this.map.fitBounds(this.geoJSONDimensiones.getBounds());

        this.proyectosService.detalleProyecto(id)
          .subscribe((pp: any) => {
            const gjLayerr = [];
            pp.tareas.forEach(t => {
              const geoJS = JSON.parse(t.geojson_subconjunto);
              geoJS.properties = t;
              gjLayerr.push(geoJS);
            });

            this.geoJSONTareas = geoJSON(gjLayerr, {
              onEachFeature: (feature, layer) => {
                layer.setStyle(this.colorAleatorio());
                if (feature.properties && feature.properties.tarenombre) {
                  layer.bindPopup(feature.properties.tarenombre);
                }
                layer.on({
                  click: () => {
                    this.nombreSeleccionado = feature.properties.tarenombre;
                    this.territorioSeleccionado = feature.properties;
                    this.tareaSeleccionada = true;
                  }
                });
              }
            }).addTo(this.map);
          });
      });


  }

  async presentPicker() {
    const picker = await this.pickerController.create({
      buttons: [{
        text: 'Cancelar'
      }, {
        text: 'Aceptar',
        handler: (val) => {
          this.nombreSeleccionado = '';
          this.territorioSeleccionado = null;
          if (this.geoJSONDimensiones) {
            this.geoJSONDimensiones.clearLayers();
            if (this.geoJSONTareas) {
              this.geoJSONTareas.clearLayers();
            }
          }

          const q: any = Object.values(val)[0];
          this.proyectoSeleccionado = q.value;
          this.detalleProyecto(this.proyectoSeleccionado.proyid);
        }
      }],
      columns: this.getColumns(1, this.proyectos),
    });
    picker.present();
  }

  async leafletMap() {
    this.map = new Map('mapPro').setView([3.4376309, -76.5429797], 13);

    tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}').addTo(this.map);

    tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wms?service=WMS', {
      layers: 'idesc:mc_barrios',
      format: 'image/png',
      transparent: !0,
      version: '1.1.0'
    }).addTo(this.map);

    this.map.on('click', () => {
      this.nombreSeleccionado = '';
      this.territorioSeleccionado = null;
    });
  }

  async presentAlertPrompt() {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      this.uiService.presentToast('Función disponible solo online');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Ingresa una nueva cantidad',
      inputs: [{
        name: 'number',
        type: 'number',
        value: this.territorioSeleccionado.tarerestriccant,
        min: 0
      }],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (e) => {
            this.territorioSeleccionado.tarerestriccant = e.number;
            this.tareaService.editarTarea(this.territorioSeleccionado)
              .subscribe(r => {
                this.uiService.presentToastSucess('Cantidad actualizada correctamente');
              }, () => {
                this.uiService.presentToastError('Error al actualizar cantidad');
              });
          }
        }
      ]
    });

    await alert.present();
  }

  getColumns(numColumns, columnOptions) {
    const columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col-${i}`,
        options: this.getColumnOptions(columnOptions)
      });
    }
    return columns;
  }
  getColumnOptions(columnOptions) {
    const options = [];
    columnOptions.forEach(element => {
      options.push({
        text: element.proynombre,
        value: element
      });
    });
    return options;
  }

  irDecision(decision) {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      this.uiService.presentToast('Función disponible solo online');
      return;
    }
    this.navCtrl.navigateForward(`/tabs/explorar/proyectista/decision/${decision}/${this.territorioSeleccionado.proyid}`);
  }

  colorAleatorio() {
    // tslint:disable-next-line: no-bitwise
    return { color: '#' + (Math.random() * 0xffbdbd << 0).toString(16) };
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}

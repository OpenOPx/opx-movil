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
    if (this.territorioSeleccionado.proj_id) {
      console.log("Entro al if de territorio")
      this.detalleProyecto(this.proyectoSeleccionado.proj_id);
    }
  }

  /*
  * Llena el atributo protectos con los proyectos actuales
  */
  cargarProyectos() {
    this.proyectosService.listadoProyectos()
      .subscribe(resp => {
        //BEYCKER REVISAR Aqui es resp.proyectos o resp.project
        //Al solicitar peticion http get en environment.API_URL + '/proyectos' se revisa eso
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

  /*
  * id: id del proyecto a buscar
  */
  detalleProyecto(id: string) {

    this.proyectosService.dimensionesTerritoriales(id)
      .subscribe(p => {
        console.log(p)
        const gjLayer = [];
        p.forEach(element => {
          //BEYCKER REVISAR: Se hace el parse o me llega directamente como json, y lo otro es el atributo
          const geoJS = JSON.parse(element.dimension_geojson);
          console.log(geoJS)
          delete element.dimension_geojson;
          geoJS.properties = element;
          gjLayer.push(geoJS);
          console.log(gjLayer)
        });

        this.geoJSONDimensiones = geoJSON(gjLayer, {
          onEachFeature: (feature, layer) => {
            //BEYCKER REVISAR: feature.properties.nombre o feature.properties. ??? pero es raro, porque segun yo, almacena el geojson y este no tiene atribito nombre
            if (feature.properties && feature.properties.dimension_name) {
              layer.bindPopup(feature.properties.dimension_name);
            }
            layer.on({
              click: () => {
                this.nombreSeleccionado = feature.properties.dimension_name;
                this.territorioSeleccionado = feature.properties; //El feature.properties tiene: dimension_id, dimension_name, dimension_type_id, isactive, neighborhood_id, preloaded
                this.tareaSeleccionada = false;
              }
            });
          }
        }).addTo(this.map);
        this.map.fitBounds(this.geoJSONDimensiones.getBounds());

        this.proyectosService.detalleProyecto(id)
          .subscribe((pp: any) => {
            const gjLayerr = [];
            console.log("Tareas")
            console.log(pp.tareas)
            pp.tareas.forEach(t => {
              //BEYCKER REVISAR -> Antes era JSON.parse(t.geojson_subconjunto) pero leonardo me dijo que me lo mandaria como json, por eso le quité el parse
              //Revisa si mandan geojson_subconjunto o dimension_geojson
              const geoJS = JSON.parse(t.dimension_geojson);
              geoJS.properties = t;
              gjLayerr.push(geoJS);
            });

            this.geoJSONTareas = geoJSON(gjLayerr, {
              onEachFeature: (feature, layer) => {
                layer.setStyle(this.colorAleatorio());
                if (feature.properties && feature.properties.task_name) {
                  layer.bindPopup(feature.properties.task_name);
                }
                layer.on({
                  click: () => {
                    this.nombreSeleccionado = feature.properties.task_name;
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
          console.log("proyecto seleccionado")
          console.log(this.proyectoSeleccionado)
          //console.log("this.proyectoSeleccionado.proj_id: " + this.proyectoSeleccionado.proj_id) //ESTA SUPER
          this.detalleProyecto(this.proyectoSeleccionado.proj_id);
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
    console.log('Territorio selecionado:')
    console.log(this.territorioSeleccionado)
    const alert = await this.alertController.create({
      header: 'Ingresa una nueva cantidad de encuestas',
      inputs: [{
        name: 'number',
        type: 'number',
        value: this.territorioSeleccionado.task_quantity,
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
            this.territorioSeleccionado.task_quantity = e.number;

            const form = {
              dimension_geojson: this.territorioSeleccionado.dimension_geojson,
              instrument_id: this.territorioSeleccionado.instrument_id,
              proj_dimension_id: this.territorioSeleccionado.proj_dimension_id,
              project_id: this.territorioSeleccionado.project_id,
              restriction_id: this.territorioSeleccionado.restriction_id,
              task_completness: this.territorioSeleccionado.task_completness,
              task_creation_date: this.territorioSeleccionado.task_creation_date,
              task_description: this.territorioSeleccionado.task_description,
              task_id: this.territorioSeleccionado.task_id,
              task_name: this.territorioSeleccionado.task_name,
              task_priority_id: this.territorioSeleccionado.task_priority_id,
              task_quantity: this.territorioSeleccionado.task_quantity,
              task_restriction_id: this.territorioSeleccionado.task_restriction_id,
              task_type_id: this.territorioSeleccionado.task_type_id,
              task_type_name: this.territorioSeleccionado.task_type_name,
              territorial_dimension_id: this.territorioSeleccionado.territorial_dimension_id,
              tarfechainicio: this.territorioSeleccionado.task_start_date,
              tarfechacierre: this.territorioSeleccionado.task_end_date,
              HoraInicio: this.territorioSeleccionado.start_time,
              HoraCierre: this.territorioSeleccionado.end_time,
            };
            this.tareaService.editarTareaProyectista(form)
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
        text: element.proj_name,
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
    console.log(decision)
    console.log(this.territorioSeleccionado)
    if(decision == 'tiempo tarea'){
      this.navCtrl.navigateForward(`/tabs/explorar/proyectista/decision/${decision}/${this.territorioSeleccionado.task_id}`);
    }else{
      this.navCtrl.navigateForward(`/tabs/explorar/proyectista/decision/${decision}/${this.proyectoSeleccionado.proj_id}`);
    }
    
  }

  colorAleatorio() {
    // tslint:disable-next-line: no-bitwise
    return { color: '#' + (Math.random() * 0xffbdbd << 0).toString(16) };
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}

import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Map, latLng, tileLayer, marker, geoJSON } from 'leaflet';
import * as leafletPip from '@mapbox/leaflet-pip';
import barrios from 'src/assets/json/idescmc_barrios.json';

import { UbicacionService } from 'src/app/servicios/ubicacion.service';
import { ContextosService } from 'src/app/servicios/contextos.service';
import { InfoContextoComponent } from 'src/app/componentes/info-contexto/info-contexto.component';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
})
export class ExplorarPage implements OnInit {

  loading = true;
  cargaReproduccion = false;

  map: Map;

  barrioSeleccionado: any;
  barrioUbicacion: any;

  geoJS: any;
  geoJSBarrios: any;

  marker: marker;

  constructor(
    private modalController: ModalController,
    private ubicacionService: UbicacionService,
    private contextoService: ContextosService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.geoJSBarrios = geoJSON(barrios);
    this.ubicacionService.obtenerUbicacionActual();
  }

  ionViewDidEnter() {
    this.listarContextos();
    this.leafletMap();
  }

  /**
   * Inicializar mapa
   */
  async leafletMap() {
    this.map = new Map('mapId').setView([3.4376309, -76.5429797], 16);

    tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}').addTo(this.map);

    tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wms?service=WMS', {
      layers: 'idesc:mc_barrios',
      format: 'image/png',
      transparent: !0,
      version: '1.1.0'
    }).addTo(this.map);

    /**
     * Evento click para extraer información de un polígono seleccionado
     */
    this.map.on('click', async e => {
      const res = this.obtenerPoligono([e.latlng.lng, e.latlng.lat]);
      if (res.length) {
        const properties = res[0].feature.properties;
        this.barrioSeleccionado = properties;
        await this.openMyModal();
        this.barrioSeleccionado = undefined;
      } else {
        this.barrioSeleccionado = undefined;
      }
    });

    await this.actualizaUbicacion();
  }

  /**
   * Modal con información de poligono seleccionado
   */
  async openMyModal() {
    if (!this.barrioUbicacion) {
      return;
    }

    if (this.barrioSeleccionado === this.barrioUbicacion) {
      this.barrioSeleccionado = undefined;
    }
    const myModal = await this.modalController.create({
      component: InfoContextoComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        barrioUbicacion: this.barrioUbicacion,
        barrioSeleccionado: this.barrioSeleccionado
      }
    });
    return await myModal.present();
  }

  actualizaUbicacion() {
    return this.ubicacionService.obtenerUbicacionActual()
      .then(async () => {

        const lat = this.ubicacionService.ubicacionActual.latitude;
        const long = this.ubicacionService.ubicacionActual.longitude;

        /* const lat = 3.477951;
        const long = -76.511594; */

        if (this.marker) {
          this.map.removeLayer(this.marker);
          const latlng = latLng(lat, long);
          this.marker.setLatLng(latlng)
            .addTo(this.map)
            .bindPopup('Ubicación actual.').openPopup();
          this.map.setView([lat, long]);
        } else {
          this.marker = marker([lat, long])
            .addTo(this.map)
            .bindPopup('Ubicación actual.').openPopup();
          this.map.setView([lat, long]);
        }

        const res = this.ubicacionService.obtenerPoligono(this.geoJSBarrios);
        if (res.length) {
          const properties = res[0].feature.properties;
          this.barrioUbicacion = properties;
        } else {
          this.barrioUbicacion = undefined;
        }

      });
  }

  async reproducir() {
    this.cargaReproduccion = true;
    await this.contextoService.reproducir(this.barrioUbicacion, this.barrioSeleccionado);
    this.cargaReproduccion = false;
  }

  listarContextos() {
    this.contextoService.listadoContextos()
      .subscribe((resp) => {
        const areasMedicion = resp;
        const gjLayer = [];
        areasMedicion.forEach(a => {
          a.datos.forEach(d => {
            const geoJS = JSON.parse(d.geojson);
            delete d.geojson;
            geoJS.features[0].properties = d;
            gjLayer.push(geoJS, { style: this.colorAleatorio() });
          });
        });

        this.geoJS = geoJSON(gjLayer, {
          onEachFeature: (feature, layer) => {
            feature.style = this.colorAleatorio();
            if (feature.properties && feature.properties.descripcion) {
              layer.bindPopup(feature.properties.descripcion);
            }
          }
        }).addTo(this.map);
        this.loading = false;
      });
  }

  obtenerPoligono(ubicacion) {
    return leafletPip.pointInLayer(ubicacion, this.geoJSBarrios);
  }

  colorAleatorio() {
    // tslint:disable-next-line: no-bitwise
    return { color: '#' + (Math.random() * 0xffbdbd << 0).toString(16) };
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}

import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { map } from 'rxjs/operators';
import * as leafletPip from '@mapbox/leaflet-pip';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  /**
   * Coordenadas de la ubicación actual.
   * ubicacionActual.latitude
   * ubicacionActual.longitude
   */
  ubicacionActual: any = {};

  constructor(private geolocation: Geolocation) {
    this.obtenerUbicacionActual();
  }

  /**
   * Regresa la ubicación actual del dispositivo móvil
   */
  obtenerUbicacionActual() {
    return this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(resp => {
      return this.ubicacionActual = resp.coords;
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch(error => {
      console.log('Error getting location', error);
    });
  }

  seguimientoUbicacion() {
    return this.geolocation.watchPosition()
      .pipe(map(data => {
        console.log('watch', data);
        return this.ubicacionActual = data.coords;
      }));
  }

  /**
   * Devuelve un arreglo de polígonos que contienen un punto.
   */
  obtenerPoligono(geoJSON) {
    return leafletPip.pointInLayer([this.ubicacionActual.longitude, this.ubicacionActual.latitude], geoJSON);
  }
}

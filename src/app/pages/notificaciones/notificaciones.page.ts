import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  cargando = true;
  notificaciones: any[] = [];

  constructor(
    private navCtrl: NavController,
    private notificacionesService: NotificacionesService
    ) { }


  ngOnInit() {
    this.cargando = true
    this.notificaciones = []
    this.listar()
    //this.pruebaDataLocalStorage();
  }
/*
  pruebaDataLocalStorage(){
    this.datalocal.guardarTokenMovil('1234');
    this.datalocal.obtenerTokenMovil().then(resp => {
      console.log(resp)
    })
  }
*/
  listar(){
    this.notificacionesService.listarNotificaciones()
    .subscribe(resp => {
      this.notificaciones.push(resp);
      this.cargando = false;
    })
    //Intento de foreach para fecha:
    this.notificaciones.forEach(element => {
      var cadenaseparacion = element.notification_date.split('T');
      element.fecha = cadenaseparacion[0];
      element.hora = cadenaseparacion[1];
    })
  }

  vaciar(){
    
    this.notificacionesService.eliminarNotificaciones()
    .subscribe(resp => {
      this.notificaciones.push(resp);
      this.cargando = false;
    })
    
   console.log("Se dio click")
  }

  cerrar(){
    this.navCtrl.pop();
    console.log('deberia cerrar')
  }

}

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  cargando = true;
  notificaciones = [];

  constructor(
    private router: Router,
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
  async listar(){
    this.notificaciones = []
    this.cargando = true
    this.notificacionesService.listarNotificaciones()
    .subscribe(resp => {
      console.log(resp)
      this.notificaciones.push(resp);
      this.notificaciones = this.notificaciones[0];
      console.log(this.notificaciones)
      for(let i = 0; i < this.notificaciones.length; i++){
        var cadenaseparacion = this.notificaciones[i].notification_date.split('T');
        this.notificaciones[i]['fecha'] = cadenaseparacion[0];
        this.notificaciones[i]['hora'] = cadenaseparacion[1].substring(0,8);
      }
      this.cargando = false;
    })
    
    //Intento de foreach para fecha:
    
    /*
    this.notificaciones.forEach(element => {
      console.log(element)
      var cadenaseparacion = element.notification_date.split('T');
      console.log(cadenaseparacion)
      element.fecha = cadenaseparacion[0];
      element.hora = cadenaseparacion[1];
    })
    */
  }

  vaciar(){
    this.cargando = true;
    this.notificacionesService.eliminarNotificaciones()
    .subscribe(resp => {
      this.notificaciones = []
      this.cargando = false;
    })
    
  }

  cerrar(){
    this.router.navigateByUrl(`/tabs/explorar`);
  }

}

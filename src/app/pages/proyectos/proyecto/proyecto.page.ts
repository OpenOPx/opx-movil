import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { ProyectosService } from 'src/app/servicios/proyectos.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Tarea } from 'src/app/interfaces/tarea';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.page.html',
  styleUrls: ['./proyecto.page.scss'],
})
export class ProyectoPage implements OnInit {

  proyecto: any = {};
  tareas: Tarea[] = [];
  tareasCompletadas: Tarea[] = [];

  segmentoTareas = true;
  segmentoValidar = false;

  cargando = true;

  proyectista = '';

  constructor(
    private proyectosService: ProyectosService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    public authService: AuthService
  ) { }

  ngOnInit() {
    //id del proyecto que se obtiene de la vista de proyectos
    this.activatedRoute.params.subscribe(params => this.detalleProyecto(params.id));
  }

  /**
   * @description Carga el detalle del proyecto para mostrar sus propiedades en pantalla
   * @param proyid id del proyecto que se va a cargar en la vista
   */
  detalleProyecto(proyid: string) {
    this.proyectosService.detalleProyecto(proyid)
      .subscribe(resp => {
        if (resp !== undefined) {
          this.proyecto = resp.proyecto;
          this.proyectista = resp.proyecto.pers_name + ' ' + resp.proyecto.pers_lastname
          console.log(this.proyecto)
          this.tareas = resp.tareas;
          this.tareasCompletadas = this.tareas.filter(t => t.progreso === 100);
        } else {
          this.proyecto = undefined;
          this.navCtrl.back();
        }
        this.cargando = false;
      });
  }

  /**
   * @description hace un swith al darle en el segmento de tareas o el de validar
   */
  segmentChanged() {
    this.segmentoTareas = !this.segmentoTareas;
    this.segmentoValidar = !this.segmentoValidar;
  }

}

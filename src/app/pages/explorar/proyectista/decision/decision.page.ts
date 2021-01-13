import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProyectosService } from 'src/app/servicios/proyectos.service';
import { TareasService } from 'src/app/servicios/tareas.service';
import { NavController } from '@ionic/angular';
import { UiService } from 'src/app/servicios/ui.service';
import { Proyecto } from 'src/app/interfaces/proyecto';
import { EquiposService } from 'src/app/servicios/equipos.service';

@Component({
  selector: 'app-decision',
  templateUrl: './decision.page.html',
  styleUrls: ['./decision.page.scss'],
})
export class DecisionPage implements OnInit {

  cargando = true;
  cargandoEquipos = true;
  tipo: string;
  proyecto: Proyecto = {};
  tarea: any = {};

  equipoActual: any[] = [];
  equipoDisponible: any[] = [];

  today = new Date();
  minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDay() + 3).toISOString();
  maxDate = new Date(this.today.getFullYear() + 1, this.today.getMonth(), this.today.getDay()).toISOString();

  constructor(
    private activatedRoute: ActivatedRoute,
    private proyectosService: ProyectosService,
    private tareasService: TareasService,
    private equiposService: EquiposService,
    private uiService: UiService,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    //Parametros recibiros por URL
    this.activatedRoute.params.subscribe(params => this.tipo = params.tipo);
    this.activatedRoute.params.subscribe(params => this.detalleProyecto(params.proyecto));

  }

  /**
   * @description Obtiene el detalle de un proyecto determinado
   * @param proyid id del proyecto al que se le quiere obtener el detalle
   */
  detalleProyecto(proyid: string) {

    if(this.tipo == 'tiempo tarea'){
      this.tareasService.detalleTarea(proyid)
      .subscribe(resp => {
        this.tarea = resp;
        this.tarea.task_id = proyid;
        console.log("Tarea apenas entra al detalle tarea")
        console.log(this.tarea)
        this.cargando = false;
      });
    }else{
      
      this.proyectosService.detalleProyecto(proyid)
        .subscribe(resp => {
          if (resp !== undefined) {
            //Revisar si el resp me trae el nombre proyecto o project
            this.proyecto = resp.proyecto;
            console.log(this.proyecto)
            this.proyecto.proj_id = proyid;
            this.cargando = false;
            if (this.tipo === 'equipos') {
              this.cargarEquipos(proyid);
            }
          } else {
            this.proyecto = undefined;
            this.navCtrl.back();
          }
          this.cargando = false;
        });
    }


  }

  /**
   * @description Carga los equipos de un proyectista
   * @param proyid id del proyecto del que se quieren obtener los esquipos disponibles y los equipos actuales asignados a ese proyecto
   */
  cargarEquipos(proyid: string) {
    this.cargandoEquipos = true;
    this.equiposService.equiposPorProyecto(proyid)
      .subscribe(r => {
        this.equipoActual = r;

        this.equiposService.usuariosDisponibles(proyid)
          .subscribe(rr => {
            this.equipoDisponible = rr;
            this.cargandoEquipos = false;
          });
      });
  }

  /**
   * @description Actualiza los cambios realizados al proyecto en la base de datos
   */
  actualizarProyecto() {

    this.cargando = true;

    const date = new Date(this.proyecto.proj_start_date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();

    const date2 = new Date(this.proyecto.proj_close_date);
    const year2 = date2.getFullYear().toString();
    const month2 = (date2.getMonth() + 1).toString();
    const day2 = date2.getDate().toString();

    if (date.getTime() > date2.getTime()) {
      this.uiService.informativeAlert('La fecha de inicio debe ser menor que la final');
      return;
    }

    const pro = {
      proj_name: this.proyecto.proj_name,
      proj_description: this.proyecto.proj_description,
      proj_start_date: `${year}-${month}-${day}`,
      proj_close_date: `${year2}-${month2}-${day2}`,
      isactive: this.proyecto.isactive,
      proj_id: this.proyecto.proj_id
    };

    this.proyectosService.actualizarProyectoMovil(pro)
      .subscribe(r => {
        this.cargando = false;
        this.uiService.presentToastSucess('Proyecto actualizado correctamente');
      }, () => {
        this.uiService.presentToastError('Error al actualizar proyecto');
      });
  }

  /**
   * @description Actualiza los cambios realizados a la tarea en la base de datos
   */
  actualizarTarea() {

    this.cargando = true;

    const date = new Date(this.tarea.task_start_date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();

    const date2 = new Date(this.tarea.task_end_date);
    const year2 = date2.getFullYear().toString();
    const month2 = (date2.getMonth() + 1).toString();
    const day2 = date2.getDate().toString();

    if (date.getTime() > date2.getTime()) {
      this.uiService.informativeAlert('La fecha de inicio debe ser menor que la final');
      return;
    }
    console.log("Tarea antes del form")
    console.log(this.tarea)

    const tar = {
      task_restriction_id: this.tarea.task_restriction,
      task_priority_id: this.tarea.task_priority,
      task_type_id: this.tarea.task_type,
      project_id: this.tarea.project,
      task_name: this.tarea.task_name,
      task_quantity: this.tarea.task_quantity,
      task_description: this.tarea.task_description,
      task_id: this.tarea.task_id,

      task_start_date: `${year}-${month}-${day}`,
      task_end_date: `${year2}-${month2}-${day2}`,
      start_time: this.tarea.start_time,
      end_time: this.tarea.end_time
    };

    this.tareasService.editarTareaProyectista(tar)
    .subscribe(r => {
      this.cargando = false;
      this.uiService.presentToastSucess('Restricciones de la tarea actualizadas correctamente');
    }, () => {
      this.uiService.presentToastError('Error al actualizar las restricciones');
    });
      
  }

  /**
   * @description Agrega un equipo a un proyecto determinado
   * @param equipo equipo seleccionado por el usuario que va a asignar como participante al proyecto
   */
  agregarEquipo(equipo) {
    equipo.eliminando = true;
    this.equiposService.agregarEquipoProyecto(this.proyecto.proj_id, equipo.team_id)
      .subscribe(() => {
        this.cargarEquipos(this.proyecto.proj_id);
      });
  }

  /**
   * @description Elimina un equipo de un proyecto determinado
   * @param equipo equipo seleccionado por el usuario que va a eliminar del proyecto
   */
  eliminarEquipo(equipo) {
    equipo.eliminando = true;
    this.equiposService.eliminarEquipoProyecto(equipo.proj_team_id)
      .subscribe(() => {
        this.cargarEquipos(this.proyecto.proj_id);
      });
  }

}

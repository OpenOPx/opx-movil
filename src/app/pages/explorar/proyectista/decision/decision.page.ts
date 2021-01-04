import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProyectosService } from 'src/app/servicios/proyectos.service';
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

  equipoActual: any[] = [];
  equipoDisponible: any[] = [];

  today = new Date();
  minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDay() + 2).toISOString();
  maxDate = new Date(this.today.getFullYear() + 1, this.today.getMonth(), this.today.getDay()).toISOString();

  constructor(
    private activatedRoute: ActivatedRoute,
    private proyectosService: ProyectosService,
    private equiposService: EquiposService,
    private uiService: UiService,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    //No tengo ni idea de que hace esto
    this.activatedRoute.params.subscribe(params => this.tipo = params.tipo);
    this.activatedRoute.params.subscribe(params => this.detalleProyecto(params.proyecto));

  }

  detalleProyecto(proyid: string) {
    this.proyectosService.detalleProyecto(proyid)
      .subscribe(resp => {
        if (resp !== undefined) {
          //Revisar si el resp me trae el nombre proyecto o project
          this.proyecto = resp.proyecto;
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

  //BEYCKER REVISAR
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

  actualizarProyecto() {

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

    this.proyectosService.actualizarProyecto(pro)
      .subscribe(r => {
        this.uiService.presentToastSucess('Proyecto actualizado correctamente');
      }, () => {
        this.uiService.presentToastError('Error al actualizar proyecto');
      });
  }

  agregarUsuario(user) {
    user.eliminando = true;
    //BEYCKER REVISAR PRIORIDAD - user.pers_id? o user.userid
    this.equiposService.agregarUsuarioProyecto(this.proyecto.proj_id, user.userid)
      .subscribe(() => {
        this.cargarEquipos(this.proyecto.proj_id);
      });
  }

  eliminarUsuario(user) {
    user.eliminando = true;
    //BEYCKER REVISAR, antes tenia equid y se susituye por team_id, pero ni idea porque un usuario normalmente no tiene un team_id
    this.equiposService.eliminarUsuarioProyecto(user.team_id)
      .subscribe(() => {
        this.cargarEquipos(this.proyecto.proj_id);
      });
  }

}

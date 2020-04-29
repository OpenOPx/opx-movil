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
    this.activatedRoute.params.subscribe(params => this.tipo = params.tipo);
    this.activatedRoute.params.subscribe(params => this.detalleProyecto(params.proyecto));

  }

  detalleProyecto(proyid: string) {
    this.proyectosService.detalleProyecto(proyid)
      .subscribe(resp => {
        if (resp !== undefined) {
          this.proyecto = resp.proyecto;
          this.proyecto.proyid = proyid;
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

    const date = new Date(this.proyecto.proyfechainicio);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();

    const date2 = new Date(this.proyecto.proyfechacierre);
    const year2 = date2.getFullYear().toString();
    const month2 = (date2.getMonth() + 1).toString();
    const day2 = date2.getDate().toString();

    if (date.getTime() > date2.getTime()) {
      this.uiService.informativeAlert('La fecha de inicio debe ser menor que la final');
      return;
    }

    const pro = {
      proynombre: this.proyecto.proynombre,
      proydescripcion: this.proyecto.proydescripcion,
      proyfechainicio: `${year}-${month}-${day}`,
      proyfechacierre: `${year2}-${month2}-${day2}`,
      proyestado: this.proyecto.proyestado,
      proyid: this.proyecto.proyid
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
    this.equiposService.agregarUsuarioProyecto(this.proyecto.proyid, user.userid)
      .subscribe(() => {
        this.cargarEquipos(this.proyecto.proyid);
      });
  }

  eliminarUsuario(user) {
    user.eliminando = true;
    this.equiposService.eliminarUsuarioProyecto(user.equid)
      .subscribe(() => {
        this.cargarEquipos(this.proyecto.proyid);
      });
  }

}

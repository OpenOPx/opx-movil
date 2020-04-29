import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { UiService } from './ui.service';
import { Tarea } from '../interfaces/tarea';
import { Proyecto, ProyectoBackend } from '../interfaces/proyecto';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  /**
   * Clase encargada de almacenar los recursos necesarios para ejecutar la aplicación cuando no haya conexión a internet.
   */
  constructor(
    private storage: Storage,
    private uiService: UiService
  ) { }

  toastOnlyOnline() {
    this.uiService.presentToast('Función disponible online');
  }

  /**
   * Función que guarda localmente los proyectos que se consultaron cuando había conexión a internet.
   */
  async guardarProyectos(proyectos: Proyecto[]) {
    for (const p of proyectos) {
      await this.guardarProyecto(p);
    }
  }

  async guardarProyecto(proyecto: Proyecto) {

    const proyectos: Proyecto[] = await this.storage.get('proyectos') || [];
    const i = proyectos.findIndex(p => p.proyid === proyecto.proyid);

    if (i >= 0) {
      proyectos[i] = proyecto;
    } else {
      proyectos.push(proyecto);
    }

    await this.storage.set('proyectos', proyectos);
  }

  /**
   * Función que guarda localmente los proyectos en detalle que se consultaron cuando había conexión a internet.
   */
  async guardarDetalleProyecto(resp: ProyectoBackend) {
    return this.guardarStorage('proyectos-detalle', resp.proyecto.proyid, resp);
  }

  /**
   * Carga del almacenamiento local un proyecto en detalle
   * @param proyid proyecto por cargar.
   */
  async detalleProyecto(proyid: string) {
    return this.cargarStorage('proyectos-detalle', proyid);
  }

  /**
   * Carga la lista de proyectos del almacenamiento local
   * @param search opcional que permite filtrar la lista
   */
  async listarProyectos(search?: string) {
    let proyectos: Proyecto[] = await this.storage.get('proyectos') || [];
    const total = proyectos.length;

    if (search) {
      proyectos = proyectos
        .filter(p => p.proynombre.toLowerCase().indexOf(search.toLowerCase()) > -1);
    }

    return {
      proyectos,
      paginator: {
        total,
        currentPage: 1,
        lastPage: 1
      }
    };
  }

  /**
   * Guarda tareas en el almacenamiento local
   */
  async guardarTareas(tareas: Tarea[]) {
    for (const t of tareas) {
      await this.guardarTarea(t);
    }
  }

  async guardarTarea(tarea: Tarea) {

    const tareas: Tarea[] = await this.storage.get('tareas') || [];
    const i = tareas.findIndex(t => t.tareid === tarea.tareid);

    if (i >= 0) {
      tareas[i] = tarea;
    } else {
      tareas.push(tarea);
    }

    await this.storage.set('tareas', tareas);
  }

  /**
   * Carga la lista de tareas del almacenamiento local
   * @param search opcional que permite filtrar la lista
   */
  async listarTareas(search?: string) {
    let tareas: Tarea[] = await this.storage.get('tareas') || [];
    const total = tareas.length;

    if (search) {
      tareas = tareas
        .filter(t => t.tarenombre.toLowerCase().indexOf(search.toLowerCase()) > -1);
    }

    return {
      tareas,
      paginator: {
        total,
        currentPage: 1,
        lastPage: 1
      }
    };
  }

  /**
   * Función que guarda localmente las tarea en detalle que se consultaron cuando había conexión a internet.
   */
  guardarDetalleTarea(tareid: string, data: Tarea) {
    return this.guardarStorage('tareas-detalle', tareid, data);
  }

  /**
   * Carga del almacenamiento local una tarea en detalle
   * @param tareid tarea por cargar.
   */
  detalleTarea(tareid: string) {
    return this.cargarStorage('tareas-detalle', tareid);
  }

  /**
   * Usado en la sección Explorar
   */
  async contextos(contextos?) {
    if (contextos) {
      const stringify = JSON.stringify(contextos);
      return await this.storage.set('contextos', stringify);
    }

    const c = await this.storage.get('contextos');
    return JSON.parse(c);
  }

  async guardarCategorizacion(data: any, barrioUbicacion: string, barrioSeleccion: string, anio: number) {
    const categorizaciones: any[] = await this.storage.get('categorizaciones') || [];

    const i = categorizaciones.findIndex(c =>
      c.barrioSeleccion === barrioSeleccion &&
      c.barrioUbicacion === barrioUbicacion &&
      c.anio === anio
    );

    const cat = { data, barrioUbicacion, barrioSeleccion, anio };

    if (i >= 0) {
      categorizaciones[i] = cat;
    } else {
      categorizaciones.push(cat);
    }

    await this.storage.set('categorizaciones', categorizaciones);
  }

  async cargarCategorizacion(barrioUbicacion: string, barrioSeleccion: string, anio: number) {
    const categorizaciones: any[] = await this.storage.get('categorizaciones') || [];

    const cat = categorizaciones.find(c =>
      c.barrioSeleccion === barrioSeleccion &&
      c.barrioUbicacion === barrioUbicacion && c.anio === anio);

    if (cat) {
      return cat.data;
    } else {
      return [];
    }

  }

  async guardarDatosContextualización(data: any, labelX: string, barrioUbicacion: string, barrioSeleccion: string, anio: number) {
    const datosCategorizacion = await this.storage.get('datos-categorizacion') || [];

    const i = datosCategorizacion.findIndex(c =>
      c.labelX === labelX &&
      c.barrioSeleccion === barrioSeleccion &&
      c.barrioUbicacion === barrioUbicacion &&
      c.anio === anio
    );

    // Elimina datos rebundantes generados por otros componentes.
    data.datasets = data.datasets.map(element => {
      return {
        data: element.data,
        borderColor: element.borderColor,
        fill: element.fill,
        label: element.label
      };
    });

    const cat = { data, labelX, barrioUbicacion, barrioSeleccion, anio };

    if (i >= 0) {
      datosCategorizacion[i] = cat;
    } else {
      datosCategorizacion.push(cat);
    }
    return this.storage.set('datos-categorizacion', datosCategorizacion);
  }

  async cargarDatosContextualizacion(labelX: string, barrioUbicacion: string, barrioSeleccion: string, anio: number) {
    const datosCategorizacion: any[] = await this.storage.get('datos-categorizacion') || [];

    const cat = datosCategorizacion.find(c =>
      c.labelX === labelX &&
      c.barrioSeleccion === barrioSeleccion &&
      c.barrioUbicacion === barrioUbicacion && c.anio === anio);

    if (cat) {
      return cat.data;
    } else {
      return undefined;
    }
  }

  guardarVerificarImplementacion(id: string, data: boolean) {
    return this.guardarStorage('verificar-implementacion', id, data);
  }

  cargarVerificarImplementacion(id: string) {
    return this.cargarStorage('verificar-implementacion', id) || false;
  }

  guardarEnlaceFormularioKoboToolbox(id: string, enlace: string) {
    return this.guardarStorage('enlaceKoboToolbox', id, enlace);
  }

  cargarEnlaceFormularioKoboToolbox(id: string) {
    return this.cargarStorage('enlaceKoboToolbox', id) || '';
  }

  guardarDetalleCartografia(tareid: string, geojson: any) {
    return this.guardarStorage('detalle-cartografia', tareid, geojson);
  }

  cargarDetalleCartografia(tareid: string) {
    return this.cargarStorage('detalle-cartografia', tareid) || '';
  }

  guardarInformacionInstrumento(tareid: string, info: any) {
    return this.guardarStorage('informacion-instrumento', tareid, info);
  }

  cargarInformacionInstrumento(tareid: string) {
    return this.cargarStorage('informacion-instrumento', tareid);
  }

  guardarDimensionesTerritoriales(proyid: string, data: any) {
    return this.guardarStorage('dimensiones-territoriales', proyid, JSON.stringify(data));
  }

  async cargarDimensionesTerritoriales(proyid: string) {
    const resp = await this.cargarStorage('dimensiones-territoriales', proyid);
    return JSON.parse(resp);
  }


  async usuario(usuario?) {
    if (usuario) {
      return this.storage.set('usuario', usuario);
    }
    const user = await this.storage.get('usuario');
    return user;
  }

  async generos(generos?) {
    if (generos) {
      return this.storage.set('generos', generos);
    }
    return await this.storage.get('generos');
  }

  async nivelesEducativos(niveles?) {
    if (niveles) {
      return this.storage.set('nivelesEdu', niveles);
    }
    return await this.storage.get('nivelesEdu');
  }

  async barrios(barrios?) {
    if (barrios) {
      return this.storage.set('barrios', barrios);
    }
    return await this.storage.get('barrios');
  }

  async elementosOSM(elementosOSM?) {
    if (elementosOSM) {
      return this.storage.set('elementosOSM', elementosOSM);
    }
    return await this.storage.get('elementosOSM');
  }

  /**
   * Método genérico que carga los elemento almacenados en localStorage
   * @param keyStorage Llave del campo
   * @param id del objeto por cargar
   */
  async cargarStorage(keyStorage: string, id: string) {
    const vi: any[] = await this.storage.get(keyStorage) || [];
    const v = vi.find(t => t.id === id);
    if (v) {
      return v.object;
    } else {
      this.uiService.presentToast('Recurso no disponible offline');
      return undefined;
    }
  }

  /**
   * Método genérico que guarda objetos en el localStorage del equipo
   * @param keyStorage Llave del campo
   * @param id del objeto por guardar
   * @param object elemento a guardar o actualizar
   */
  async guardarStorage(keyStorage: string, id: string, object: any) {
    const arreglo: any[] = await this.storage.get(keyStorage) || [];
    const index = arreglo.findIndex(t => t.id === id);

    const resp = { id, object };

    if (index >= 0) {
      arreglo[index] = resp;
    } else {
      arreglo.push(resp);
    }

    return this.storage.set(keyStorage, arreglo);
  }

}

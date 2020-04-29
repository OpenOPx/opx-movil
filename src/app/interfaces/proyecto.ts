import { Tarea } from './tarea';

export interface Proyecto {
    proyid?: string;
    proynombre?: string;
    proydescripcion?: string;
    proyectista?: string;
    proyfechacreacion?: Date;
    proyfechacierre?: string;
    proyfechainicio?: string;
    proyidexterno?: string;
    proyestado?: number;
    tareas?: Tarea[];
}

export interface ProyectoBackend {
    proyecto: Proyecto;
    tareas: Tarea[];
}

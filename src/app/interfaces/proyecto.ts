import { Tarea } from './tarea';

export interface Proyecto {
    proj_id?: string;
    proj_name?: string;
    proj_description?: string;
    proj_owner_id?: string; //ANTES SE LLAMABA PROYECTISTA
    proj_creation_date?: Date;
    proj_close_date?: string;
    proj_start_date?: string;
    proj_external_id?: string;
    isactive?: number;
    tasks?: Tarea[]; //Creo que se trae tasks o task, el nombre lo arreglo con leonardo
}
//HAY QUE MIRAR COMO SE MAPEA ESTO EN EL BACk
export interface ProyectoBackend {
    proyecto: Proyecto;
    tareas: Tarea[];
}

/*
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
*/
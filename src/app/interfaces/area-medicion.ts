import { Tarea } from './tarea';

export interface AreaMedicion {
    proyid: string;
    nombre: string;
    geojson: string;
    geoJS: Object;
}

export interface AreaMedicionBack {
    areasMedicion: [{ areaMedicion: AreaMedicion, tareas: Tarea[] }];
}

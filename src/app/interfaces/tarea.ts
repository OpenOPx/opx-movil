import { NumberSymbol } from "@angular/common";

export interface Tarea {
    task_id: string;
    task_name: string;
    task_type_id: number;
    task_type: number;
    isactive: number;
    instrument: string;
    task_observation: string;
    progreso: number; //Antes era progreso
    task_restriction: any;
    project: any;
    task_quantity: number; 
    instrument_id: string; 
    proj_id: string; 
    instrument_name: string; 
    territorial_dimension_id: string;
    geojson_subconjunto: any; 
    task_creation_date: Date; 
    task_description: string;
    task_completness: number;
    task_start_date: any;
    task_end_date: any;
    start_time: any;
    end_time: any;
}

//Propiedades antes definidas por el equipo Neuromedia
/*
export interface Tarea {
    tareid: string;
    tarenombre: string;
    taretipo: number;
    tareestado: number;
    observaciones: string;
    tarerestricgeo: any;
    progreso: number;
    tarerestriccant: number;
    tarerestrictime: any;
    instrid: string;
    proyid: string;
    instrnombre: string;
    dimensionid: string;
    geojson_subconjunto: string;
    geoJS_subconjunto: Object;
    tarefechacreacion: Date;
    tarefechaejecucion: Date;
    taredescripcion: string;
}
*/
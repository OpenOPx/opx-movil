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

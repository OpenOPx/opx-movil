export interface Tarea {
    task_id: string;
    task_name: string;
    task_type_id: number;
    isactive: number;
    task_observation: string;
    //tarerestricgeo: any; //NO SE QUE SEA ESTE VALOR
    progreso: number; //Antes era progreso
    //RESTRICCIONES
    task_restriction: any,
    //tareafechadeejecucion
    //task_quantity: number; 
    //Nos llegan los demas atributos de task restriction
    //- MUERE tarerestrictime: any; //NO SE QUE SEA
    instrument_id: string; //PUEDE LLEGAR EL ID DEL INSTRUMENTO, O EL OBJETO INSTRUMENTO
    proj_id: string; //Necesito el id del proyecto
    instrument_name: string; //YA NO HAY INSTRUMENTO
    territorial_dimension_id: string;
    geojson_subconjunto: any; //YA ME MANDA UN JSON NO UN STRING, HAY QUE QUITARLE EL PARSE DE LOS ARCHIVOS QUE LO INVOCAN
    //geoJS_subconjunto: Object; //MUERE MALDITO
    task_creation_date: Date; //CREO QUE ESTA ES task_creation_date
    //tarefechaejecucion: Date; //CREO QUE ES task_start_date
    task_description: string;
}

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
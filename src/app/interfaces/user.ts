export interface User {
    pers_id?: string;
    //userfullname?: string;
    pers_name?: string;
    pers_lastname?: string;
    useremail?: string;
    role_id?: string;
    role_name?: string;
    password?: string;
    pers_score?: number;
    education_level_id?: string;
    neighborhood_id?: string;
    pers_birthdate?: string;
    gender_id?: string;
    pers_telephone?: string;
    promocion?: any; //OJO CON PROMOCION
    fcm_token?: any;
}

/*
export interface User {
    userid?: string;
    useremail?: string;
    rol?: string;
    rolname?: string;
    password?: string;
    puntaje?: number;
    nivel_educativo_id?: string;
    barrioid?: string;
    fecha_nacimiento?: string;
    generoid?: string;
    userfullname?: string;
    telefono?: string;
    promocion?: any;
    tokenmovil?: any;
}

*/

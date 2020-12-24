import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoTarea'
})
export class TipoTareaPipe implements PipeTransform {

  /**
   * @description Retorna el tipo de una Tarea como cadena de 'string' de acuerdo al tipo de tarea
   * @param taretipo 
   */
  transform(taretipo: number): string {
    if (taretipo === 1) {
      return 'Encuesta';
    } else if (taretipo === 2) {
      return 'Mapeo';
    }
  }

}

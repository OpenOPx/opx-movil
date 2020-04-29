import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoTarea'
})
export class TipoTareaPipe implements PipeTransform {

  /**
   * Regresa un tipo de Tarea en `string` de acuerdo al tipo de tarea
   */
  transform(taretipo: number): string {
    if (taretipo === 1) {
      return 'Encuesta';
    } else if (taretipo === 2) {
      return 'Mapeo';
    }
  }

}

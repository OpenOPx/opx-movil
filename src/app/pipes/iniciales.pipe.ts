import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iniciales'
})
export class InicialesPipe implements PipeTransform {

  /**
   * @description Obtiene la primera letra de dos palabras. Si solo contiene una palabra se optiene solo la primera.
   * @param value cadena de texto que puede contener 2 palabras separadas por espacio
   */
  transform(value: string): string {
    const split = value.split(' ');
    if (split.length >= 2) {
      let text = '';
      for (let i = 0; i < 2; i++) {
        text += split[i].charAt(0);
      }
      return text;
    } else {
      return value.charAt(0) + ' ';
    }
  }

}

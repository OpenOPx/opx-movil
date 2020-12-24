import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizerStyle'
})
export class SanitizerStylePipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) { }

  /**
   * @description DOM para estilos seguros
   * bypassSecurityTrustStyle(url) Omite la seguridad y confía en que el valor dado es un valor de estilo seguro (CSS).
   * @param url cadena con texto en formato CSS
   */
  transform(url: string): any {
    return this.domSanitizer.bypassSecurityTrustStyle(url);
  }

}

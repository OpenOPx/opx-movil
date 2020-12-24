import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizer'
})
export class SanitizerPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) { }

  /**
   * @description Habilita una dirección web para que pueda ser utilizada en la aplicación.
   * El método bypassSecurityTrustResourceUrl(url) Omité la seguridad y confía en que el valor dado de la URL es de recurso seguro, es decir, una ubicación que puede usarse para cargar código ejecutable, como <script src> o <iframe src>.
   * @param url 
   */
  transform(url: string): any {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

}

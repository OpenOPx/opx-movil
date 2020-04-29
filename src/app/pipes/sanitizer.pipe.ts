import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizer'
})
export class SanitizerPipe implements PipeTransform {

  /**
   * Habilita una dirección web para que pueda ser utilizada en la aplicación.
   */
  constructor(private domSanitizer: DomSanitizer) { }

  transform(url: string): any {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

}

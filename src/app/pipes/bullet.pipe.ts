import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bullet',
  pure: false
})
export class BulletPipe implements PipeTransform {

  /**
   * Regresa solo los rangos con la variable `show` habilitada
   */
  transform(ranges: any[]): any[] {
    return ranges.filter(r => r.show);
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicialesPipe } from './iniciales.pipe';
import { TipoTareaPipe } from './tipo-tarea.pipe';
import { SanitizerPipe } from './sanitizer.pipe';
import { BulletPipe } from './bullet.pipe';
import { SanitizerStylePipe } from './sanitizer-style.pipe';

@NgModule({
  declarations: [InicialesPipe, TipoTareaPipe, SanitizerPipe, BulletPipe, SanitizerStylePipe],
  imports: [
    CommonModule
  ],
  exports: [InicialesPipe, TipoTareaPipe, SanitizerPipe, BulletPipe, SanitizerStylePipe]
})
export class PipesModule { }

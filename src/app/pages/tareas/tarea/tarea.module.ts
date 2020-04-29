import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TareaPage } from './tarea.page';
import { EncuestaComponent } from './encuesta/encuesta.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MapeoComponent } from './mapeo/mapeo.component';

import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ValidarComponent } from './encuesta/validar/validar.component';

const routes: Routes = [{
  path: '',
  component: TareaPage
}];

@NgModule({
  entryComponents: [EncuestaComponent, MapeoComponent, ValidarComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule,
    LeafletModule,
    LeafletDrawModule
  ],
  declarations: [TareaPage, EncuestaComponent, MapeoComponent, ValidarComponent]
})
export class TareaPageModule { }

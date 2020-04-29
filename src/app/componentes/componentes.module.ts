import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TareasComponent } from './tareas/tareas.component';
import { TareaComponent } from './tarea/tarea.component';
import { IonicModule } from '@ionic/angular';
import { PeticionLoginComponent } from './peticion-login/peticion-login.component';
import { ModalRegistroComponent } from './auth/modal-registro/modal-registro.component';
import { ModalLoginComponent } from './auth/modal-login/modal-login.component';
import { FormsModule } from '@angular/forms';
import { ModalAuthComponent } from './auth/modal-auth/modal-auth.component';
import { PipesModule } from '../pipes/pipes.module';
import { InfoContextoComponent } from './info-contexto/info-contexto.component';
import { jqxBulletChartModule } from 'jqwidgets-ng/jqxbulletchart';

@NgModule({
  declarations: [
    TareasComponent,
    TareaComponent,
    PeticionLoginComponent,
    ModalRegistroComponent,
    ModalLoginComponent,
    ModalAuthComponent,
    InfoContextoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PipesModule,
    jqxBulletChartModule
  ],
  exports: [
    TareasComponent,
    PeticionLoginComponent,
    ModalRegistroComponent,
    ModalLoginComponent,
    ModalAuthComponent,
    InfoContextoComponent
  ]
})
export class ComponentesModule { }

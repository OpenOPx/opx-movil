import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { IonicModule } from '@ionic/angular';

import { TareasPage } from './tareas.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';
import { ModalLoginComponent } from 'src/app/componentes/auth/modal-login/modal-login.component';
import { ModalRegistroComponent } from 'src/app/componentes/auth/modal-registro/modal-registro.component';

const routes: Routes = [
  {
    path: '',
    component: TareasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    RoundProgressModule,
    ComponentesModule
  ],
  entryComponents: [ModalRegistroComponent, ModalLoginComponent],
  declarations: [TareasPage]
})
export class TareasPageModule { }

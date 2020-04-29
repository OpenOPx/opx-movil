import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProyectoPage } from './proyecto.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ModalLoginComponent } from 'src/app/componentes/auth/modal-login/modal-login.component';
import { ModalRegistroComponent } from 'src/app/componentes/auth/modal-registro/modal-registro.component';

const routes: Routes = [
  {
    path: '',
    component: ProyectoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentesModule,
    PipesModule
  ],
  entryComponents: [ModalRegistroComponent, ModalLoginComponent],
  declarations: [ProyectoPage]
})
export class ProyectoPageModule { }

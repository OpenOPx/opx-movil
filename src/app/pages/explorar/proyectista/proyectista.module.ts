import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProyectistaPage } from './proyectista.page';

const routes: Routes = [
  {
    path: '',
    component: ProyectistaPage
  }, {
    path: 'decision/:tipo/:proyecto',
    loadChildren: () => import('./decision/decision.module').then(m => m.DecisionPageModule)
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProyectistaPage]
})
export class ProyectistaPageModule { }

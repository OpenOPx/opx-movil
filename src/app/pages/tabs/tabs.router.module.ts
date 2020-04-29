import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [{
  path: 'tabs',
  component: TabsPage,
  children: [{
    path: 'proyectos',
    loadChildren: () => import('../proyectos/proyectos.module').then(m => m.ProyectosPageModule)
  }, {
    path: 'tareas',
    loadChildren: () => import('../tareas/tareas.module').then(m => m.TareasPageModule)
  }, {
    path: 'perfil',
    loadChildren: () => import('../perfil/perfil.module').then(m => m.PerfilPageModule)
  }, {
    path: 'explorar',
    loadChildren: () => import('../explorar/explorar.module').then(m => m.ExplorarPageModule)
  }, {
    path: 't/:id',
    loadChildren: () => import('../tareas/tarea/tarea.module').then(m => m.TareaPageModule)
  }, {
    path: '',
    redirectTo: '/tabs/explorar',
    pathMatch: 'full'
  }]
}, {
  path: '',
  redirectTo: '/tabs/explorar',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

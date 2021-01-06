import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Tarea } from 'src/app/interfaces/tarea';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.scss'],
})
export class TareaComponent implements OnInit {

  //El input va a recibir una tarea de un componente padre que contenga a este componente "Tarea" como hijo
  @Input() tarea: Tarea;

  constructor(private navCtrl: NavController) { }

  ngOnInit() { 
    console.log(this.tarea)
  }

  click() {
    /**
     * tabs.router.module.ts
     * path: 'tabs',
     *path: 't/:id',
      loadChildren: () => import('../tareas/tarea/tarea.module').then(m => m.TareaPageModule)
     */
    this.navCtrl.navigateForward(`/tabs/t/${this.tarea.task_id}`);
  }

}

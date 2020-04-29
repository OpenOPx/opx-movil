import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Tarea } from 'src/app/interfaces/tarea';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.scss'],
})
export class TareaComponent implements OnInit {

  @Input() tarea: Tarea;



  constructor(private navCtrl: NavController) { }

  ngOnInit() { }

  click() {
    this.navCtrl.navigateForward(`/tabs/t/${this.tarea.tareid}`);
  }

}

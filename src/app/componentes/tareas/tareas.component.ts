import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss'],
})
export class TareasComponent implements OnInit {

  @Input() tareas: [] = [];
  @Input() cargando = true;

  constructor() { }

  ngOnInit() { }

}

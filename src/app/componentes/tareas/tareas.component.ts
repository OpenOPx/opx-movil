import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss'],
})
export class TareasComponent implements OnInit {

  //Recibe de un componente padre las propiedades "tareas" y "cargando"
  @Input() tareas: [] = [];
  @Input() cargando = true;

  constructor() { }

  ngOnInit() { }

}

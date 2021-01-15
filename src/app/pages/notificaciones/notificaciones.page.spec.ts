import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

import { NotificacionesPage } from './notificaciones.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {IonicStorageModule} from '@ionic/storage';

import { Network } from '@ionic-native/network/ngx';

describe('NotificacionesPage', () => {
  let component: NotificacionesPage;
  let fixture: ComponentFixture<NotificacionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ NotificacionesPage ],
      providers: [Network, NotificacionesService],
      imports: [ IonicStorageModule.forRoot(), HttpClientTestingModule,
        RouterTestingModule.withRoutes([])]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  */
 describe('when listar() is called ', () => {
  it('all should be fine', () => {
    const notificaciones = [1, 2, 3];
    spyOn(component.notificacionesService, 'listarNotificaciones').and.returnValue(of( notificaciones ));
    component.listar();
    expect(component.notificaciones).toEqual( notificaciones );
  });

  it('all should be fine with true in cargando', () => {
    const notificaciones = [1, 2, 3];
    spyOn(component.notificacionesService, 'listarNotificaciones').and.returnValue(of( notificaciones ));
    component.listar();
    expect(component.cargando).toBeTruthy();
  });
 })

 describe('when vaciar() is called ', () => {
  it('all should be fine', () => {
    const notificaciones = [];
    spyOn(component.notificacionesService, 'listarNotificaciones').and.returnValue(of( notificaciones ));
    component.vaciar();
    expect(component.notificaciones).toEqual( [] );
  });

  it('all should be fine with true in cargando', () => {
    const notificaciones = [];
    spyOn(component.notificacionesService, 'listarNotificaciones').and.returnValue(of( notificaciones ));
    component.vaciar();
    expect(component.cargando).toBeTruthy();
  });
 })


});

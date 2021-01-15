import { getTestBed, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { NotificacionesService } from './notificaciones.service';
import { Injector } from '@angular/core';
import {IonicStorageModule} from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { RouterTestingModule } from '@angular/router/testing';

import { Network } from '@ionic-native/network/ngx';

describe('NotificacionesService', () => {
  let service: NotificacionesService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Network, Geolocation],
      imports: [IonicStorageModule.forRoot(), HttpClientTestingModule, RouterTestingModule.withRoutes([])]
    });
    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
    //service = TestBed.inject(NotificacionesService);
  });
  
  it('should be return an observable to notificaciones', () => {
    const service: NotificacionesService = TestBed.get(NotificacionesService);
    const notifiPrueba = [ {id_notificacion: 'pruebaId1', notification_type: 1}, {id_notificacion: 'pruebaId2', notification_type: 2} ];
    service.listarNotificaciones().subscribe(notifications => {
      expect(notifications).toEqual(notifiPrueba);
    });

    const req = httpMock.expectOne('http://opx.variamos.com/notificaciones/list/');
    expect(req.request.method).toBe('GET');
    req.flush(notifiPrueba);
    //expect(service).toBeTruthy();
  });
  
});

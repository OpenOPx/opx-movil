import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { AuthService } from './auth.service';
import { UiService } from './ui.service';

const STORAGE_REQ_KEY = 'requests';

interface StoredRequest {
  url: string;
  type: string;
  data: any;
  time: number;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {

  /**
   * Servicio encargado de gestionar las acciones realizadas en modo offline y sincronizarlas cuando exista una conexión a internet
   */
  constructor(
    private storage: Storage,
    private http: HttpClient,
    private uiService: UiService,
    private authService: AuthService,
    private toastController: ToastController,
  ) { }

  checkForEvents(): Observable<any> {
    return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
      switchMap(async storedOperations => {
        const storedObj = JSON.parse(storedOperations);
        if (storedObj && storedObj.length > 0) {

          const loading = await this.uiService.presentLoading('Cargando acciones realizadas offline');

          return this.sendRequests(storedObj).toPromise()
            .then(() => {
              loading.dismiss().then(() => {
                const toast = this.toastController.create({
                  message: `¡Los datos sincronizados correctamente!`,
                  duration: 3000,
                  position: 'middle',
                  color: 'success'
                });
                toast.then(t => t.present());
              });

              this.storage.remove(STORAGE_REQ_KEY);
            }); /*
            .pipe(
              finalize(async () => {

              })
            ); */
        } else {
          console.log('No local events to sync');
          return of(false);
        }
      })
    );
  }


  sendRequests(operations: StoredRequest[]) {
    const obs = [];

    const headers = new HttpHeaders({
      Authorization: this.authService.token,
      'Content-Type': 'application/json'
    });

    for (const op of operations) {
      console.log('Make one request: ', op);
      const oneObs = this.http.request(op.type, op.url, { body: op.data, headers });
      obs.push(oneObs);
    }

    return forkJoin(obs);
  }

  storeRequest(url, type, data) {
    const toast = this.toastController.create({
      message: `Datos almacenados localmente porque parece estar desconectado.`,
      duration: 3000,
      animated: true,
      position: 'bottom'
    });
    toast.then((t: any) => t.present());

    const action: StoredRequest = {
      url, type, data, time: new Date().getTime(),
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
    };

    return this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
      let storedObj = JSON.parse(storedOperations);

      if (storedObj) {
        storedObj.push(action);
      } else {
        storedObj = [action];
      }
      // Save old & new local transactions back to Storage
      return this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
    });
  }
}

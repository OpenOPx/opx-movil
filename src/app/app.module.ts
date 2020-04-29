import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Network } from '@ionic-native/network/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { ModalAuthComponent } from './componentes/auth/modal-auth/modal-auth.component';
import { ComponentesModule } from './componentes/componentes.module';
import { ModalLoginComponent } from './componentes/auth/modal-login/modal-login.component';
import { ModalRegistroComponent } from './componentes/auth/modal-registro/modal-registro.component';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [ModalAuthComponent, ModalLoginComponent, ModalRegistroComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    ComponentesModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    InAppBrowser,
    Network,
    TextToSpeech,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

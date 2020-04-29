import { Injectable } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Injectable({
  providedIn: 'root'
})
export class TextoVozService {

  /**
   * Plugin que centraliza la función de convertir una cadena de texto a voz audible.
   */
  constructor(
    private tts: TextToSpeech
  ) { }

  /**
   * Convierte texto a voz.
   */
  interpretar(text: string) {
    return this.tts.speak({
      text,
      locale: 'es-CO',
    }).catch(reason => console.log('reason', reason));
  }
}

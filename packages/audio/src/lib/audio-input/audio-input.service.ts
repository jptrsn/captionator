import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioInputService {

  public selectedInput: Signal<string>;
  constructor() { 
    console.log('audio input service constructor');
    this.selectedInput = signal('');
  }

  public listAudioDevices(): Signal<MediaDeviceInfo[]> {
    const list = signal<MediaDeviceInfo[]>([]);
    navigator.mediaDevices.enumerateDevices().then((info: MediaDeviceInfo[]) => {
      console.log('got media device info list', info);
      list.set(info);
    });
    return list;
  }
}

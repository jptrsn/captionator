import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioInputService {

  private _deviceInfoList: WritableSignal<MediaDeviceInfo[]>;
  constructor() { 
    console.log('audio input service constructor');
    this._deviceInfoList = signal<MediaDeviceInfo[]>([]);
    this.listAudioDevices();
  }

  public listAudioDevices(): Signal<MediaDeviceInfo[]> {
    console.log('list audio devices')
    if (!this._deviceInfoList()?.length) {
      navigator.mediaDevices.enumerateDevices().then((info: MediaDeviceInfo[]) => {
        this._deviceInfoList.set(info);
      });
    }
    return this._deviceInfoList;
  }

  public hasAudioPermission(opt: { input?: boolean, output?: boolean}): Signal<boolean> {
    const perm = computed(() => this._deviceInfoList().some((info) => {
      if (opt.input && info.kind === 'audioinput') {
        return !!info.deviceId;
      }
      if (opt.output && info.kind === 'audiooutput') {
        return !!info.deviceId;
      }
      return ((info.kind === 'audioinput' || info.kind === 'audiooutput') && !!info.deviceId)
    }))
    return perm;
  }

  public getAudioInputStream(): Observable<MediaStream> {
    return from(navigator.mediaDevices.getUserMedia({video: false, audio: true}));
  }
}

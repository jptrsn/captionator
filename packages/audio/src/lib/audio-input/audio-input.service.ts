import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';
import { Observable, from, tap } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class AudioInputService {

  private _deviceInfoList: WritableSignal<MediaDeviceInfo[]>;
  constructor() { 
    this._deviceInfoList = signal<MediaDeviceInfo[]>([]);
    this._refreshDeviceInfoList();
    navigator.mediaDevices.addEventListener('deviceChange', () => this._refreshDeviceInfoList())
  }

  public listAudioDevices(): Signal<MediaDeviceInfo[]> {
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

  public getAudioInputStream(deviceId?: string): Observable<MediaStream> {
    return from(navigator.mediaDevices.getUserMedia({video: false, audio: {
      echoCancellation: true,
      noiseSuppression: true,
      channelCount: 1,
      sampleRate: 1600,
      deviceId
    } })).pipe(
      tap(() => {
        this._refreshDeviceInfoList();
      })
    );
  }

  public recordAudioStream(stream: MediaStream): MediaRecorder {
    const recorder = new MediaRecorder(stream);
    return recorder;
  }

  private _refreshDeviceInfoList(): void {
    navigator.mediaDevices.enumerateDevices().then((info: MediaDeviceInfo[]) => {
      this._deviceInfoList.set(info.filter((value) => !!value.deviceId));
    });
  }
}

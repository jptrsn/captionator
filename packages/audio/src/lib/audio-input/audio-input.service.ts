import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';
import { Observable, Subject, from, tap } from 'rxjs';
@Injectable({
  providedIn: 'any'
})
export class AudioInputService {

  public micLevel$: Subject<number> = new Subject<number>();

  private _deviceInfoList: WritableSignal<MediaDeviceInfo[]>;
  private _context: AudioContext;
  constructor() { 
    this._deviceInfoList = signal<MediaDeviceInfo[]>([]);
    this._context = new window.AudioContext();
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
    this._observeAudioStream(stream, recorder);
    return recorder;
  }

  private _refreshDeviceInfoList(): void {
    navigator.mediaDevices.enumerateDevices().then((info: MediaDeviceInfo[]) => {
      this._deviceInfoList.set(info.filter((value) => !!value.deviceId));
    });
  }

  private _observeAudioStream(stream: MediaStream, recorder: MediaRecorder): void {
    const sourceNode: MediaStreamAudioSourceNode = this._context.createMediaStreamSource(stream);
    const analyserNode: AnalyserNode = this._context.createAnalyser();    
    sourceNode.connect(analyserNode);
    const pcmData = new Float32Array(analyserNode.fftSize);
    let stop = false;
    recorder.addEventListener('stop', () => stop = true);
    const onFrame = () => {
        analyserNode.getFloatTimeDomainData(pcmData);
        let sumSquares = 0.0;
        for (const amplitude of pcmData) { sumSquares += amplitude*amplitude; }
        const volLevel: number = Math.sqrt(sumSquares / pcmData.length);
        this.micLevel$.next(volLevel);
        if (!stop) {
          window.requestAnimationFrame(onFrame);
        }
    };
    window.requestAnimationFrame(onFrame);
  }
}

import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Signal, WritableSignal, computed, signal } from '@angular/core';
import { AudioInputService } from '@captionator/audio';
import { Subject, catchError, of, take } from 'rxjs';

@Component({
  selector: 'captionator-input-device',
  standalone: true,
  imports: [
    CommonModule,
  ],
  providers: [AudioInputService],
  templateUrl: './input-device.component.html',
  styleUrls: ['./input-device.component.scss']
})

export class InputDeviceComponent implements OnInit, OnDestroy {
  public inputState: WritableSignal<string | null>;
  public inputs: Signal<MediaDeviceInfo[]>;
  public access: Signal<boolean>;

  private activeStream?: MediaStream;
  private onDestroy$: Subject<void> = new Subject<void>();
  constructor(@Inject(AudioInputService) private inputService: AudioInputService) {
    this.inputState = signal<string | null>(null);
    const inputList: Signal<MediaDeviceInfo[]> = this.inputService.listAudioDevices();
    this.inputs = computed(() => inputList().filter((info) => (info.kind === 'audioinput' && info.deviceId !== '')));
    this.access = this.inputService.hasAudioPermission({input: true});
  }
  
  ngOnInit(): void {
    console.log('init');
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  streamAudio() {
    this.inputService.getAudioInputStream().pipe(
      take(1),
      catchError((err) => {
        console.log(err.message);
        this.inputState.set(`Error: ${err.message}`);
        return of(err);
      })
    ).subscribe((stream: MediaStream) => {
      this.activeStream = stream;
      const recorder = new MediaRecorder(stream);
      recorder.addEventListener('dataavailable',  (ev: BlobEvent) => {
        console.log('data available', ev);
      });
      recorder.addEventListener('error', (ev: Event) => {
        console.log('recorder err', ev);
      })
      recorder.addEventListener('start', (ev: Event) => {
        console.log('recorder start', ev);
      })
      recorder.addEventListener('stop', (ev: Event) => {
        console.log('recorder stop', ev);
      })
      recorder.start();
    })
  }

  stopStream() {
    if (this.activeStream) {
      this.activeStream.getAudioTracks().forEach((track) => track.stop());
      delete this.activeStream;
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Signal, WritableSignal, computed, signal } from '@angular/core';
import { AudioInputService, AudioModule } from '@captionator/audio';
import { Subject, catchError, of, take } from 'rxjs';

@Component({
  selector: 'captionator-input-device',
  standalone: true,
  imports: [
    CommonModule,
    AudioModule,
  ],
  templateUrl: './input-device.component.html',
  styleUrls: ['./input-device.component.scss']
})

export class InputDeviceComponent implements OnInit, OnDestroy {
  public inputState: WritableSignal<string | null>;
  public inputs: Signal<MediaDeviceInfo[]>;
  public access: Signal<boolean>;

  private onDestroy$: Subject<void> = new Subject<void>();
  constructor(private inputService: AudioInputService) {
    this.inputState = signal<string | null>(null);
    const inputList: Signal<MediaDeviceInfo[]> = this.inputService.listAudioDevices();
    // this.inputs  = this.inputService.listAudioDevices();
    this.inputs = computed(() => inputList().filter((info) => (info.kind === 'audioinput' && info.deviceId !== '')));
    this.access = this.inputService.hasAudioPermission({input: true});
  }
  
  ngOnInit(): void {
    console.log('init');
    // this.streamAudio();
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
    ).subscribe((stream) => {
      console.log('stream', stream);
    })
  }
}

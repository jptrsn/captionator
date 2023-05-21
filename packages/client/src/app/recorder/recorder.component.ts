import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, map, take, takeUntil, throttleTime } from 'rxjs';
import { AudioInputService } from '@captionator/audio';


@Component({
  selector: 'captionator-recorder',
  standalone: true,
  imports: [CommonModule],
  providers: [AudioInputService],
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss'],
})
export class RecorderComponent implements OnInit, OnDestroy {

  @ViewChild('audioPlayer', {read: ElementRef}) player!: ElementRef;

  public isRecording: WritableSignal<boolean> = signal(false);
  public audioUrl: WritableSignal<string> = signal('')
  public volume: WritableSignal<number> = signal(0);
  
  private recordedData$: Subject<Blob> = new Subject<Blob>();
  private stop$: Subject<void> = new Subject<void>();
  private onDestroy$: Subject<void> = new Subject<void>();
  constructor(@Inject(AudioInputService) private inputService: AudioInputService) {}

  ngOnInit(): void {
    this.inputService.listAudioDevices();
    this.recordedData$.pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((data: Blob) => {
      const audioURL = URL.createObjectURL(data);
      this.player.nativeElement.src = audioURL;
      this.audioUrl.set(audioURL)
    });
    this.inputService.micLevel$.pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((volume) => {
      this.volume.set(volume);
    })
  }

  ngOnDestroy(): void {
    if (this.isRecording()) {
      this.stop$.next();
    }
    this.onDestroy$.next();
  }

  start(): void {
    console.log('start');
    this.isRecording.set(true);
    this.inputService.getAudioInputStream().pipe(
      take(1),
    ).subscribe((stream: MediaStream) => {
      const recorder = this.inputService.recordAudioStream(stream)
      this._initRecorder(recorder);
    });
  }

  stop(): void {
    console.log('stop');
    this.stop$.next();
    this.isRecording.set(false);
  }

  private _initRecorder(recorder: MediaRecorder): void {
    let data: Blob[] = [];
    
    recorder.ondataavailable = (ev: BlobEvent) => {
      data.push(ev.data);
    }

    recorder.onstop = () => {
      console.log('onstop', data);
      if (data.length) {
        const blob = new Blob(data, { type: "audio/mp3; codecs=opus" });
        this.recordedData$.next(blob);
        data = [];
      }
    }
    
    recorder.start();

    this.inputService.micLevel$.pipe(
      takeUntil(this.stop$),
      throttleTime(250),
      map((value) => Math.round(value * 100) / 100)
    ).subscribe((level) => {
      console.log('level', level);
      if (level === 0) {
        recorder.requestData();
      }
    })

    this.stop$.pipe(
      take(1)
    ).subscribe(() => {
      recorder.stop();
    })
  }
}

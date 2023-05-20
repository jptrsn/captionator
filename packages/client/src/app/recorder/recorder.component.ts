import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, map, take, takeUntil } from 'rxjs';
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
  
  private recordedData$: Subject<Blob> = new Subject<Blob>();
  private stop$: Subject<void> = new Subject<void>();
  private onDestroy$: Subject<void> = new Subject<void>();
  constructor(@Inject(AudioInputService) private inputService: AudioInputService) {}

  ngOnInit(): void {
    this.inputService.listAudioDevices();
    this.recordedData$.pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((data: Blob) => {
      console.log('got data', this.player);
      const audioURL = URL.createObjectURL(data);
      this.player.nativeElement.src = audioURL;
      console.log('set audio url', audioURL);
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
      map((stream: MediaStream) => this.inputService.recordAudioStream(stream))
    ).subscribe((recorder: MediaRecorder) => {
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
      console.log('got data chunk', ev.data);
      data.push(ev.data);
    }

    recorder.onstop = (ev: Event) => {
      console.log('onstop', data);
      const blob = new Blob(data, { type: "audio/mp3; codecs=opus" });
      this.recordedData$.next(blob);
      data = [];
    }
    
    recorder.start();

    this.stop$.pipe(
      take(1)
    ).subscribe(() => {
      recorder.stop();
      
    })
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, WritableSignal, signal } from '@angular/core';
import { RecognitionService } from '@captionator/audio';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'captionator-recognition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recognition.component.html',
  styleUrls: ['./recognition.component.scss'],
})
export class RecognitionComponent implements OnInit, OnDestroy {
  
  public liveText: WritableSignal<string> = signal('');
  public capturedText: WritableSignal<string> = signal('');
  private readonly stop$: Subject<void> = new Subject<void>();
  private readonly onDestroy$: Subject<void> = new Subject<void>();
  constructor(private recog: RecognitionService) {
  }

  ngOnInit(): void {
    this.recog.init();
    this.recog.recognizedText$.pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((capturedText: string | undefined) => {
      console.log('captured text', capturedText)
      if (capturedText) {
        this.capturedText.update((str) => {
          return str + ' ' + capturedText;
        });
        this.liveText.set('');
      }
    })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  startCapture(): void {
    this.recog.start().pipe(
      takeUntil(this.stop$)
    ).subscribe((partialResults: string) => {
      this.liveText.set(partialResults);
    })
  }

  stopCapture(): void {
    this.stop$.next();
    this.recog.stop();
  }
}

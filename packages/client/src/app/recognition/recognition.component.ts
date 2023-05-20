import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit, WritableSignal, signal } from '@angular/core';
import { AudioModule, LanguageCheckerService, RecognitionService } from '@captionator/audio';
import { Observable, Subject, filter, switchMap, take, takeUntil } from 'rxjs';


@Component({
  selector: 'captionator-recognition',
  standalone: true,
  imports: [CommonModule, HttpClientModule, AudioModule],
  providers: [HttpClientModule],
  templateUrl: './recognition.component.html',
  styleUrls: ['./recognition.component.scss'],
})
export class RecognitionComponent implements OnInit, OnDestroy {
  
  public liveText: WritableSignal<string> = signal('');
  public capturedText: WritableSignal<string> = signal('');
  public correctedFullText: WritableSignal<string> = signal('');
  private readonly baseHref: string = 'http://api.educoder.dev/language';
  private readonly stop$: Subject<void> = new Subject<void>();
  private readonly onDestroy$: Subject<void> = new Subject<void>();
  constructor(private recog: RecognitionService,
              private http: HttpClient,
              private checker: LanguageCheckerService) {
  }

  ngOnInit(): void {
    this.recog.init();
    this.checker.init(this.baseHref, this.http);
    this.recog.recognizedText$.pipe(
      takeUntil(this.onDestroy$),
      filter((text) => !!text),
      switchMap((text: string) => this.checker.correct(text))
    ).subscribe((capturedText: string | undefined) => {
      if (capturedText) {
        this.capturedText.update((str) => {
          return str + ' ' + capturedText;
        });
        this.liveText.set('');
      }
    })
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.onDestroy$.next();
  }

  startCapture(): void {
    this.recog.start().pipe(
      takeUntil(this.stop$)
    ).subscribe((partialResults: string) => {
      this.liveText.set(partialResults);
    });
    this.stop$.pipe(
      take(1)
    ).subscribe(() => {
      this.recog.stop();
      this.liveText.set('');
    })
  }

  stopCapture(): void {
    console.log('stop emitting')
    this.stop$.next();
  }
}

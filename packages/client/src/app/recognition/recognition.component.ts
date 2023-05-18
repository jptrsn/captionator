import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, WritableSignal, signal } from '@angular/core';
import { LanguageCheckerService, LanguageToolCheckResponse, RecognitionService } from '@captionator/audio';
import { Observable, Subject, catchError, filter, map, of, switchMap, take, takeUntil } from 'rxjs';


@Component({
  selector: 'captionator-recognition',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [HttpClientModule],
  templateUrl: './recognition.component.html',
  styleUrls: ['./recognition.component.scss'],
})
export class RecognitionComponent implements OnInit, OnDestroy {
  
  public liveText: WritableSignal<string> = signal('');
  public capturedText: WritableSignal<string> = signal('');
  public correctedFullText: WritableSignal<string> = signal('');
  private readonly baseHref: string = 'http://192.168.1.13:8081';
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
      switchMap((text: string) => this.checker.correct(text + '.'))
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
    const liveTextResults$: Observable<string> = this.recog.start();
    liveTextResults$.pipe(
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
    this.stop$.next();
  }
}

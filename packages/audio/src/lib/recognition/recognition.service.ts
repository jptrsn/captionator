import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
declare const webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class RecognitionService {
  private liveOutput$: ReplaySubject<string> = new ReplaySubject<string>();
  public recognizedText$: Subject<string> = new Subject<string>;
  private transcript?: string;
  private isStoppedSpeechRecog: boolean;
  private recognition: any;
  constructor() { 
    this.recognition = new webkitSpeechRecognition();
    this.isStoppedSpeechRecog = true;
  }

  init(): void {

    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.addEventListener('result', (e: any) => {
      this.transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.liveOutput$.next(this.transcript);
    });
  }

  start(): Observable<string> {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    this.recognition.addEventListener('end', () => {
      console.log('recognition end')
      this.recognizedText$.next(this.transcript as string);
      delete this.transcript;
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log("End speech recognition")
      } else {
        this.recognition.start();
      }
    });
    return this.liveOutput$.pipe(
      distinctUntilChanged()
    );
  }

  stop(): void {
    this.isStoppedSpeechRecog = true;
    this.recognition.stop();
    this.liveOutput$.complete();
    console.log("End speech recognition")
  }
}

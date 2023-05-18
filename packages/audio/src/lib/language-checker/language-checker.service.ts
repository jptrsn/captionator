import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LanguageToolCheckResponse } from './language-checker.model';

@Injectable({
  providedIn: 'root',
})
export class LanguageCheckerService {
  
  private baseHref?: string;
  private http!: HttpClient;

  init(serverAddress: string, client: HttpClient): void {
    this.baseHref = serverAddress;
    this.http = client;
  }

  check(text: string): Observable<LanguageToolCheckResponse> {
    const headers: HttpHeaders = new  HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    const body: HttpParams = new HttpParams({
      fromObject: {
        text,
        language: navigator.language || 'auto',
        level: 'picky',
        // disabledRules: 'THE_SENT_END'
      }
    });
    return this.http.post(`${this.baseHref}/v2/check`, body, { headers }) as Observable<LanguageToolCheckResponse>;
  }

  correct(text: string): Observable<string> {
    return this.check(text).pipe(
      map((result: LanguageToolCheckResponse) => this._correctResults(text, result)),
      map((text: string) => this.terminate(text))
    )
  }

  terminate(text: string): string {
    if (text.match(/[^!"#$%&'()*+,.]$/)) {
      console.log('appending full stop', text);
      text += '.';
    }
    return text;
  }

  private _correctResults(originalText: string, result: LanguageToolCheckResponse): string {
    let response: string = originalText;
    result.matches.forEach((match) => {
      if (!match.replacements?.length) {
        console.error('no replacements avaiable for match', match);
        return;
      }
      response = response.substring(0, match.offset) + match.replacements[0].value + response.substring(match.offset + match.length);
    });
    return response;
  }
}

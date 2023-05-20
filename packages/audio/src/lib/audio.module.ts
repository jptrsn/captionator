import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { audioRoutes } from './lib.routes';
import { AudioInputService } from './audio-input/audio-input.service';
import { RecognitionService } from './recognition/recognition.service';
import { LanguageCheckerService } from './audio.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(audioRoutes),
  ],
  providers: [
    AudioInputService,
    RecognitionService,
    LanguageCheckerService,
  ]
})
export class AudioModule {
}
export * from './audio-input/audio-input.service';
export * from './recognition/recognition.service';
export * from './language-checker/language-checker.service';
export * from './language-checker/language-checker.model';
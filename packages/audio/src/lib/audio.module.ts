import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { audioRoutes } from './lib.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(audioRoutes),
  ]
})
export class AudioModule {
}
export * from './audio-input/audio-input.service';
export * from './recognition/recognition.service';
export * from './language-checker/language-checker.service';
export * from './language-checker/language-checker.model';
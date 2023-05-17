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
export * from './audio-input/audio-input.service'
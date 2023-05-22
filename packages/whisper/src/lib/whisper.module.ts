import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptureComponent } from './capture/capture.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CaptureComponent],
  exports: [
    CaptureComponent,
  ]
})
export class WhisperModule {}

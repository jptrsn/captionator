import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioModule } from '@captionator/audio';

@Component({
  selector: 'captionator-input-device',
  standalone: true,
  imports: [
    CommonModule,
    AudioModule,
  ],
  templateUrl: './input-device.component.html',
  styleUrls: ['./input-device.component.scss']
})
export class InputDeviceComponent {
  public selectedInput = signal('mic');
  constructor() {
    console.log('input device component constructor', this.selectedInput());
  }
}

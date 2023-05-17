import { CommonModule } from '@angular/common';
import { Component, Signal, computed } from '@angular/core';
import { AudioInputService, AudioModule } from '@captionator/audio';

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
  public selectedInput: Signal<string>;
  constructor(private inputService: AudioInputService) {
    this.selectedInput = computed(() => this.inputService.selectedInput());
    console.log('input device component constructor', this.selectedInput());
  }
}

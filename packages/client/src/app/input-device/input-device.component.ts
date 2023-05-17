import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'captionator-input-device',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-device.component.html',
  styleUrls: ['./input-device.component.scss']
})
export class InputDeviceComponent {
  public selectedInput = signal('mic');
}

import { Route } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { InputDeviceComponent } from './input-device/input-device.component';
import { RecognitionComponent } from './recognition/recognition.component';
import { RecorderComponent } from './recorder/recorder.component';

export const appRoutes: Route[] = [
  { path: '', component: NxWelcomeComponent },
  { path: 'input', component: InputDeviceComponent },
  { path: 'recognition', component: RecognitionComponent },
  { path: 'recorder', component: RecorderComponent }
];

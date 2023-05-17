import { Route } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { InputDeviceComponent } from './input-device/input-device.component';

export const appRoutes: Route[] = [
  { path: '', component: NxWelcomeComponent },
  { path: 'input', component: InputDeviceComponent }
];

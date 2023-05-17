import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDeviceComponent } from './input-device.component';

describe('InputDeviceComponent', () => {
  let component: InputDeviceComponent;
  let fixture: ComponentFixture<InputDeviceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InputDeviceComponent]
    });
    fixture = TestBed.createComponent(InputDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

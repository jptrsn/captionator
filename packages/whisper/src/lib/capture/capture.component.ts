import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModelService } from '../model.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'captionator-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss'],
})
export class CaptureComponent implements OnInit, OnDestroy {
  constructor(private modelService: ModelService) {}

  private onDestroy$: Subject<void> = new Subject<void>();
  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}

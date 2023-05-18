import { TestBed } from '@angular/core/testing';

import { LanguageCheckerService } from './language-checker.service';

describe('LanguageCheckerService', () => {
  let service: LanguageCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

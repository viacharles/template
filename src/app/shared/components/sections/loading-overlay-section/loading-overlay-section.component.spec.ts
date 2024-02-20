import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoadingOverlaySectionComponent} from './loading-overlay-section.component';

describe('LoadingOverlaySectionComponent', () => {
  let component: LoadingOverlaySectionComponent;
  let fixture: ComponentFixture<LoadingOverlaySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingOverlaySectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingOverlaySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FitContentTextareaComponent} from './fit-content-textarea.component';

describe('FitContentTextareaComponent', () => {
  let component: FitContentTextareaComponent;
  let fixture: ComponentFixture<FitContentTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FitContentTextareaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FitContentTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationSectionComponent } from './presentation-section.component';

describe('PresentationSectionComponent', () => {
  let component: PresentationSectionComponent;
  let fixture: ComponentFixture<PresentationSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PresentationSectionComponent]
    });
    fixture = TestBed.createComponent(PresentationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

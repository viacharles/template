import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalSelectPresentationSectionComponent } from './normal-select-presentation-section.component';

describe('NormalSelectPresentationSectionComponent', () => {
  let component: NormalSelectPresentationSectionComponent;
  let fixture: ComponentFixture<NormalSelectPresentationSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalSelectPresentationSectionComponent]
    });
    fixture = TestBed.createComponent(NormalSelectPresentationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

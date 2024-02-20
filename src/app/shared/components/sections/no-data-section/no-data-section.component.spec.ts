import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NoDataSectionComponent} from './no-data-section.component';

describe('NoDataSectionComponent', () => {
  let component: NoDataSectionComponent;
  let fixture: ComponentFixture<NoDataSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoDataSectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDataSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

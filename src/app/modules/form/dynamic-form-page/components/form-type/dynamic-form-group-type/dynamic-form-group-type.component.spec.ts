import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DynamicFormGroupTypeComponent} from './dynamic-form-group-type.component';

describe('DynamicFormGroupTypeComponent', () => {
  let component: DynamicFormGroupTypeComponent;
  let fixture: ComponentFixture<DynamicFormGroupTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicFormGroupTypeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormGroupTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

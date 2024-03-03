import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DynamicFormBasicTypeComponent} from './dynamic-form-basic-type.component';

describe('DynamicFormBasicTypeComponent', () => {
  let component: DynamicFormBasicTypeComponent;
  let fixture: ComponentFixture<DynamicFormBasicTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicFormBasicTypeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormBasicTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

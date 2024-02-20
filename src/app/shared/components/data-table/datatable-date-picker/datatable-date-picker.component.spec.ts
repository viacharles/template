import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DataTableDatePickerComponent} from './datatable-date-picker.component';

describe('DataTableDatePickerComponent', () => {
  let component: DataTableDatePickerComponent;
  let fixture: ComponentFixture<DataTableDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataTableDatePickerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

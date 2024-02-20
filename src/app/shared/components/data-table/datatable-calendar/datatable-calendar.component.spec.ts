import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DataTableCalendarComponent} from './datatable-calendar.component';

describe('DataTableCalendarComponent', () => {
  let component: DataTableCalendarComponent;
  let fixture: ComponentFixture<DataTableCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataTableCalendarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTablePaginationComponent } from './datatable-pagination.component';

describe('DataTablePaginationComponent', () => {
  let component: DataTablePaginationComponent;
  let fixture: ComponentFixture<DataTablePaginationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataTablePaginationComponent]
    });
    fixture = TestBed.createComponent(DataTablePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

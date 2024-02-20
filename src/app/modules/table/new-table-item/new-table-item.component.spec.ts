import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTableItemComponent } from './new-table-item.component';

describe('NewTableItemComponent', () => {
  let component: NewTableItemComponent;
  let fixture: ComponentFixture<NewTableItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTableItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

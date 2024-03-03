import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortThComponent } from './sort-th.component';

describe('SortThComponent', () => {
  let component: SortThComponent;
  let fixture: ComponentFixture<SortThComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SortThComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortThComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

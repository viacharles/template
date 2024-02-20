import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxSetComponent } from './checkbox-set.component';

describe('CheckboxSetComponent', () => {
  let component: CheckboxSetComponent;
  let fixture: ComponentFixture<CheckboxSetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxSetComponent]
    });
    fixture = TestBed.createComponent(CheckboxSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

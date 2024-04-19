import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorderLessButtonComponent } from './borderless-button.component';

describe('BorderLessButtonComponent', () => {
  let component: BorderLessButtonComponent;
  let fixture: ComponentFixture<BorderLessButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorderLessButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorderLessButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioSetComponent } from './radio-set.component';

describe('RadioSetComponent', () => {
  let component: RadioSetComponent;
  let fixture: ComponentFixture<RadioSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioSetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadioSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

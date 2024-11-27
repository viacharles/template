import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleComponent } from './toggle.component';

describe('ToggleComponent', () => {
  let component: ToggleComponent<string>;
  let fixture: ComponentFixture<ToggleComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToggleComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ToggleComponent<string>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

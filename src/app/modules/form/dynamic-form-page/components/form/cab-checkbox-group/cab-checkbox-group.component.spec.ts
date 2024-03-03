import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CabCheckboxGroupComponent} from './cab-checkbox-group.component';

describe('CabCheckboxGroupComponent', () => {
  let component: CabCheckboxGroupComponent;
  let fixture: ComponentFixture<CabCheckboxGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CabCheckboxGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CabCheckboxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

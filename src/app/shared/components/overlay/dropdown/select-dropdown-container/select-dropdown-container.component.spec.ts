import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDropdownContainerComponent } from './select-dropdown-container.component';

describe('SelectDropdownContainerComponent', () => {
  let component: SelectDropdownContainerComponent;
  let fixture: ComponentFixture<SelectDropdownContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectDropdownContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectDropdownContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

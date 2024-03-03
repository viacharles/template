import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFieldEditDialogComponent } from './dynamic-field-edit-dialog.component';

describe('DynamicFieldEditDialogComponent', () => {
  let component: DynamicFieldEditDialogComponent;
  let fixture: ComponentFixture<DynamicFieldEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFieldEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamicFieldEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

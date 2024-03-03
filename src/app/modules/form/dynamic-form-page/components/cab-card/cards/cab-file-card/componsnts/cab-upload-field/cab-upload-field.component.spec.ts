import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CabUploadFieldComponent} from './cab-upload-field.component';

describe('CabUploadFieldComponent', () => {
  let component: CabUploadFieldComponent;
  let fixture: ComponentFixture<CabUploadFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CabUploadFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CabUploadFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

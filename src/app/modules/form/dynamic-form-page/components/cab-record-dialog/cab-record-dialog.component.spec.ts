import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CabRecordDialogComponent} from './cab-record-dialog.component';

describe('CabRecordDialogComponent', () => {
  let component: CabRecordDialogComponent;
  let fixture: ComponentFixture<CabRecordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CabRecordDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CabRecordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

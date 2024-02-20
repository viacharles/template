import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SideTabPopupDialogComponent} from './side-tab-popup-dialog.component';

describe('SideTabPopupDialogComponent', () => {
  let component: SideTabPopupDialogComponent;
  let fixture: ComponentFixture<SideTabPopupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SideTabPopupDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideTabPopupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

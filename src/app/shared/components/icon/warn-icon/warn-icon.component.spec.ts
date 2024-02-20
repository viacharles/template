import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WarnIconComponent} from './warn-icon.component';

describe('WarnIconComponent', () => {
  let component: WarnIconComponent;
  let fixture: ComponentFixture<WarnIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarnIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarnIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

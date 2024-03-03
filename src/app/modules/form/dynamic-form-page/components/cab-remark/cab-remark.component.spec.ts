import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CabRemarkComponent} from './cab-remark.component';

describe('CabRemarkComponent', () => {
  let component: CabRemarkComponent;
  let fixture: ComponentFixture<CabRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CabRemarkComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CabRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

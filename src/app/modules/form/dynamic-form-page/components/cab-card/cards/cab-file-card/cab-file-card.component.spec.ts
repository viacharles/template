import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CabFileCardComponent} from './cab-file-card.component';

describe('CabFileCardComponent', () => {
  let component: CabFileCardComponent;
  let fixture: ComponentFixture<CabFileCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CabFileCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CabFileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

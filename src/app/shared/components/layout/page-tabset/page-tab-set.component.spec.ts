import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PageTabSetComponent} from './page-tab-set.component';

describe('PageTabSetComponent', () => {
  let component: PageTabSetComponent;
  let fixture: ComponentFixture<PageTabSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageTabSetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageTabSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

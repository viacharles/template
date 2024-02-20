import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SimpleCardComponent} from './simple-card.component';

describe('SimpleCardComponent', () => {
  let component: SimpleCardComponent<any>;
  let fixture: ComponentFixture<SimpleCardComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

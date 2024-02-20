import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AccordionListCardComponent} from './accordion-list-card.component';

describe('AccordionListCardComponent', () => {
  let component: AccordionListCardComponent;
  let fixture: ComponentFixture<AccordionListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccordionListCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomBubbleChartComponent} from './custom-bubble-chart.component';

describe('CustomBubbleChartComponent', () => {
  let component: CustomBubbleChartComponent;
  let fixture: ComponentFixture<CustomBubbleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomBubbleChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomBubbleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

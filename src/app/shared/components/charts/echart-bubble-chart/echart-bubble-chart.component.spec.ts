import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EchartBubbleChartComponent} from './echart-bubble-chart.component';

describe('EchartBubbleChartComponent', () => {
  let component: EchartBubbleChartComponent;
  let fixture: ComponentFixture<EchartBubbleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EchartBubbleChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartBubbleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

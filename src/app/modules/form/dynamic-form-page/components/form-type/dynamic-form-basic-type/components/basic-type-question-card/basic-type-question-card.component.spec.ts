import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicTypeQuestionCardComponent } from './basic-type-question-card.component';

describe('BasicTypeQuestionCardComponent', () => {
  let component: BasicTypeQuestionCardComponent;
  let fixture: ComponentFixture<BasicTypeQuestionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicTypeQuestionCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BasicTypeQuestionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

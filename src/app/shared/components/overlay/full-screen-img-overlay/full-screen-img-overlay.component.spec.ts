import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FullScreenImgOverlayComponent} from './full-screen-img-overlay.component';

describe('FullScreenImgOverlayComponent', () => {
  let component: FullScreenImgOverlayComponent;
  let fixture: ComponentFixture<FullScreenImgOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FullScreenImgOverlayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullScreenImgOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

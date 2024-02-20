import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import {IPosition} from '@utilities/interface/common.interface';
@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements AfterViewInit, OnChanges {
  @ViewChild('tTooltip') tTooltip?: ElementRef;
  @Input() innerHtml = '';
  @Input() borderColor = '';
  @Input() position?: IPosition;

  constructor(public self: ElementRef) {}
  public selfWidth = 0;
  public selfHeight = 0;
  public topDiff = '';
  public leftDiff = '';

  ngAfterViewInit(): void {
    this.selfWidth = this.tTooltip?.nativeElement.clientWidth;
    this.selfHeight = this.tTooltip?.nativeElement.clientHeight;
    this.topDiff =
      (this.position?.isTop
        ? this.position!.y
        : this.position!.y - this.selfHeight) + 'px';
    this.leftDiff =
      (this.position?.isLeft
        ? this.position!.x
        : this.position!.x - this.selfWidth) + 'px';
  }

  ngOnChanges(): void {
    setTimeout(() => {
      this.topDiff =
        (this.position?.isTop
          ? this.position!.y
          : this.position!.y - this.selfHeight) + 'px';
      this.leftDiff =
        (this.position?.isLeft
          ? this.position!.x
          : this.position!.x - this.selfWidth) + 'px';
    }, 0);
  }
}

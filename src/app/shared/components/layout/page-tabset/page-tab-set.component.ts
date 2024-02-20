import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-page-tab-set',
  templateUrl: './page-tab-set.component.html',
  styleUrls: ['./page-tab-set.component.scss'],
})
export class PageTabSetComponent implements OnChanges {
  /** 跳至第幾個tab */
  @Input() callToggle = 0;
  @Input() tabs?: {nameI18n: string}[];
  @Output() toggleIndex = new EventEmitter<number>();

  public tabIndex = 0;

  ngOnChanges({callToggle}: SimpleChanges): void {
    if (callToggle.currentValue) this.tabIndex = callToggle.currentValue;
  }
}

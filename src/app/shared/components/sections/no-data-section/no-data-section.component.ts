import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-no-data-section',
  templateUrl: './no-data-section.component.html',
  styleUrls: ['./no-data-section.component.scss'],
})
export class NoDataSectionComponent {
  @Input() i18nCode = 'portfolio.no-data';
  @Input() imgUrl = '';
  @Input() fillDirection: 'width' | 'height' = 'width';
  @Input() type: 'normal' | 'low-height' = 'normal';
}

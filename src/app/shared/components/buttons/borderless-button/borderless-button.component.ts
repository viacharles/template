import { Component, Input, SimpleChanges } from '@angular/core';
import { Base } from '@utilities/base/base';
import { EColorType, ESize } from '@utilities/enum/common.enum';

@Component({
  selector: 'app-borderless-button',
  templateUrl: './borderless-button.component.html',
  styleUrl: './borderless-button.component.scss'
})
export class BorderLessButtonComponent extends Base {
  @Input() title = '';
  @Input() icon = '';
  @Input() type: EColorType = EColorType.Default;
  @Input() size: ESize = ESize.M;
  /** 有背景色 */
  @Input() hasBg = true;
}

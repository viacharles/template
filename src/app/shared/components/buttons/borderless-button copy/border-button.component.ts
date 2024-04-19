import { Component, Input } from '@angular/core';
import { Base } from '@utilities/base/base';
import { EColorType, ESize } from '@utilities/enum/common.enum';

@Component({
  selector: 'app-border-button',
  templateUrl: './border-button.component.html',
  styleUrl: './border-button.component.scss'
})
export class BorderButtonComponent extends Base {
  @Input() title = '';
  @Input() icon = '';
  @Input() type: EColorType = EColorType.Default;
  @Input() size: ESize = ESize.M;
}

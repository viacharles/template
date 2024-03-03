import { Component, Input } from '@angular/core';
import { EColorType, ESize } from '@utilities/enum/common.enum';

@Component({
  selector: 'app-text-button',
  templateUrl: './text-button.component.html',
  styleUrl: './text-button.component.scss'
})
export class TextButtonComponent {
  @Input() title = '';
  @Input() type: EColorType = EColorType.Primary;
  @Input() size: ESize = ESize.Medium;
  /** 有框 */
  @Input() hasFrame = true;
}

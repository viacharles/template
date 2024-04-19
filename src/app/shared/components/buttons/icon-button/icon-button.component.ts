import { Component, Input } from '@angular/core';
import { ESize } from '@utilities/enum/common.enum';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss'
})
export class IconButtonComponent {
  @Input() classes: string = '';
  @Input() size: ESize = ESize.M;
}

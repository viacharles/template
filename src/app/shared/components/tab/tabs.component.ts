import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  CustomForm,
  getFormProvider,
} from '@utilities/abstract/customForm.abstract';
import {upFadeInAndCompressOut} from '@utilities/helper/animations.helper';
export interface ITab {
  titleI18n: string;
  iconClasses?: string;
  hide?: boolean;
  innerHTML?: string;
  value?: string | number;
}
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  providers: [getFormProvider(TabsComponent)],
  animations: [upFadeInAndCompressOut()],
})
export class TabsComponent
  extends CustomForm<number | string>
  implements OnChanges
{
  @Input() tabs: ITab[] = [];
  /** 是否標籤寬度平均容器寬度 */
  @Input() isEvenlyDistribute = true;
  /** 標籤文字排版 */
  @Input() tabTextAlign: 'start' | 'center' | 'end' = 'center';
  @Input() containerPadding?: string;
  @Input() tabWidth?: string;
  @Input() tabPadding?: string;
  @Input() tabContainerPadding?: string;
  @Input() defaultTab: string | number = 0;
  @Output() tabIndex = new EventEmitter<number | string>();

  public override model = '';
  public override disabled = false;

  constructor() {
    super();
  }

  ngOnChanges({defaultTab}: SimpleChanges): void {
    if (defaultTab) {
      this.model = `${this.defaultTab}`;
      this.notifyValueChange();
    }
  }

  public toggle(tab: ITab): void {
    this.notifyValueChange(`${tab.value}`);
    this.tabIndex.emit(tab.value);
  }
}

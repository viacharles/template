import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
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
  implements OnInit, OnChanges
{
  @ViewChild('tUl') tUl?: ElementRef<HTMLElement>;
  @Input() tabs: ITab[] = [];
  /** 是否標籤寬度平均容器寬度 */
  @Input() isEvenlyDistribute = true;
  /** 標籤文字排版 */
  @Input() tabTextAlign: 'start' | 'center' | 'end' | 'between' = 'center';
  @Input() containerPadding?: string;
  @Input() tabMinWidth?: string;
  @Input() tabPadding?: string;
  @Input() tabContainerPadding?: string;
  @Input() defaultTab: string | number = 0;
  @Output() tabIndex = new EventEmitter<number | string>();

  public override model = '';
  public override disabled = false;

  constructor(
    private self: ElementRef<HTMLElement>,
    private renderer: Renderer2
    ) {
    super();
  }

  ngOnInit(): void {
    const timer = setTimeout(() => {this.renderer.addClass(this.tUl?.nativeElement, 'fade-in')}, 200)
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

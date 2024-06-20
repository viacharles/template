import {
  CustomForm,
  getFormProvider,
} from '@utilities/abstract/customForm.abstract';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input, Output, ViewChild
} from '@angular/core';
import { WindowService } from '@shared/service/window.service';
import { IOption } from '@utilities/interface/common.interface';
import { IDynamicFieldValue } from '@utilities/interface/api/df-api.interface';
import { OverlayService } from '@shared/service/overlay.service';
import { SelectDropdownComponent } from '@shared/components/overlay/dropdown/select-dropdown/select-dropdown.component';
import { ISelectDropdownData } from '@utilities/interface/overlay.interface';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [getFormProvider(SelectComponent)],
})
export class SelectComponent<T extends IOption<string>>
  extends CustomForm<string | [IDynamicFieldValue]>
  {
  @ViewChild('tDropDown') tDropDown?: ElementRef<HTMLElement>;
  @Output() select = new EventEmitter<T>();
  @Input() options: T[] = [];
  @Input() placeholder = 'common.please-select';
  @Input() enableAll = false;
  @Input() dropDownDirection?: 'above' | 'below' = 'below';
  @Input() override disabled = false;
  @Input() errorMessage?: string;
  @Input() isError?: boolean;
  /** 是 Dynamic 系統模式： IDynamicFieldValue */
  @Input() isDynamic = false;

  constructor(
    private readonly selfElem: ElementRef,
    private readonly $window: WindowService,
    private readonly $overlay: OverlayService
  ) {
    super();
  }

  public isOpen = false;

  get currentOption(): T | undefined {
    return this.options?.find(({ code }) => this.model && code === (this.isDynamic ? (this.model[0] as IDynamicFieldValue)?.value : this.model));
  }

  public open() {
    if (!this.disabled) {
      const self = this.selfElem.nativeElement.getBoundingClientRect() as DOMRect;
      this.$overlay.addDialog<ISelectDropdownData>(
        SelectDropdownComponent,
        {
          options: this.options,
          width: self.width,
          height: self.height,
          alignTo: {
            x: {
              diff: self.right
            },
            y: {
              diff: self.top
            }
          },
        },
        {
          isBackDropTransparent: true,
          callback: {
            confirm: this.selectOption.bind(this),
            cancel: () => this.isOpen = false,
          }
        }
      )
    }
    this.isOpen = this.disabled ? false : !this.isOpen;
  }

  /** 選擇選項 */
  public selectOption(option?: T): void {
    this.isOpen = false;
    this.notifyValueChange(this.isDynamic ? [{ value: option ? option.code : '', memo: '' }] : option ? option.code : '');
    this.select.emit(option);
  }

  public click(event: Event): void {
    this.isOpen = !this.isOpen;
  }
}

import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { CustomForm, getFormProvider } from '@utilities/abstract/customForm.abstract';
import { IDynamicFieldValue } from '@utilities/interface/api/cab-api.interface';
import { IDynamicOption } from '@utilities/interface/form.interface';

@Component({
  selector: 'app-radio-set',
  templateUrl: './radio-set.component.html',
  styleUrl: './radio-set.component.scss',
  providers: [getFormProvider(RadioSetComponent)],
})
export class RadioSetComponent extends CustomForm<[IDynamicFieldValue]> implements AfterViewInit {
  @Input() options: IDynamicOption<string>[] = [];
  /** 是否 直排版 */
  @Input() isColumn = true;
  /** 最小寬度 / 欄位 */
  @Input() minWidth = '';
  @Input() isError = false;
  @Input() errorMessage = '';
  @Input() override disabled = false;
  @Input() name?: string;
  @Input() groupMarginTop?: string;
  /** 無資料樣式 */
  @Input() noData = false;

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngAfterViewInit(): void {
    if (this.options && this.options?.length > 0 && this.model && this.model?.length > 0) {
      this.setChecks();
      this.cdr.detectChanges();
    };
  }

  public change(value: IDynamicFieldValue): void {
    this.notifyValueChange([value]);
    this.setChecks();
  }

  public memoChange(memo: string, index: number): void {
    this.options[index].memo = memo;
    const value = this.model as [IDynamicFieldValue];
    value[index].memo = memo;
    this.notifyValueChange(value);
  }

  private setChecks(): void {
    this.options.forEach((option, index) => {
      const checked = this.model!.some(m => typeof m.value === 'number' ? +m.value === +option.code : `${m.value}` === `${option.code}`);
      this.options[index].isSelect = checked;
    });
  }
}

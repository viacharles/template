import { OnChanges, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { FormControl, FormArray, AbstractControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { OnInit, Output } from '@angular/core';
import { Component, ElementRef, Input } from '@angular/core';
import { WindowService } from '@shared/service/window.service';
import { takeUntil } from 'rxjs';
import { IOption, IOptionView } from '@utilities/interface/common.interface';
import { CustomForm, getFormProvider } from '@utilities/abstract/customForm.abstract';
import { IDynamicFieldValue } from '@utilities/interface/api/cab-api.interface';
import { objectDeepCompare } from '@utilities/helper/comparison.helper';
import { ESize } from '@utilities/enum/common.enum';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [getFormProvider(MultiSelectComponent)]
})
export class MultiSelectComponent extends CustomForm<(string | number)[] | IDynamicFieldValue[] | null> implements OnInit, OnChanges, AfterViewInit {
  @ViewChildren('tOptions') tOptions?: QueryList<ElementRef>;
  /** 是 Dynamic 系統模式： IDynamicFieldValue */
  @Input() isDynamic = false;
  @Input() id = '';
  @Input() options?: IOption[];
  @Input() hasFilter = false;
  @Input() isError = false;
  @Input() errorMessage?: string;
  @Input() override disabled = false;
  @Input() placeholder = '可複選';
  @Input() filterPlaceholder = '請輸入關鍵字搜尋';
  @Output() select = new EventEmitter<(string | number)[] | IDynamicFieldValue[] | null>();
  get f() { return this.form.controls };
  get size() { return ESize };

  constructor(private selfElem: ElementRef, private $window: WindowService, private fb: FormBuilder, private cdr: ChangeDetectorRef) { super() }

  public form = this.fb.group({ checks: new FormArray<FormControl<boolean | null>>([]) });
  public showDropdown = false;
  /** 選擇到的項目 */
  public checkedOptions: IOption<(string | number)>[] | null = null;
  public optionsInDropdown?: IOptionView[];
  /** 紀錄 */
  private preOption?: IOption[];

  ngOnInit(): void {
    this.$window.click$.pipe(takeUntil(this.onDestroy$))
      .subscribe(click => {
        if (!this.selfElem.nativeElement.contains(click.target)) {
          this.showDropdown = false;
        }
      });
  }

  ngOnChanges({options}: SimpleChanges): void {
    if (!this.preOption ? true : options ? objectDeepCompare(options.currentValue, this.preOption) : false) {
      const currentOptions = options.currentValue as IOption[];
      this.preOption = currentOptions;
      if(this.checkedOptions) {
      this.reCreateForm(currentOptions as IOption[]);
      };
      this.optionsInDropdown = currentOptions.map(option => ({ ...option, ...{ show: true } }));
    };
  }

  ngAfterViewInit(): void {
    if (this.options && this.options?.length > 0 && this.model && this.model?.length > 0) {
      this.init();
    };
  }

  public filter(event: Event): void {
    if (!(event instanceof KeyboardEvent) || (event.code === 'Enter' && !event.isComposing)) {
      this.optionsInDropdown =
        this.optionsInDropdown?.map(option => {
          option.show = option.name.includes((event.target as HTMLInputElement).value)
          return option;
        });
    };
  }

  public cancelSelect(select: IOption, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    };
    const IndexToCancel = (this.optionsInDropdown as IOption[]).findIndex(option => option.code === select.code);
    this.f.checks.controls[IndexToCancel].setValue(false);
  }

  public cancelAll(event: Event): void {
    event.preventDefault();
    this.f.checks.setValue(Array(this.f.checks.controls.length).fill(false));
  }

  private reCreateForm(options: IOption[]): void {
    this.form = this.fb.group({ checks: new FormArray<FormControl<boolean | null>>([]) });
    this.optionsInDropdown?.forEach(option => this.f.checks.push(new FormControl<boolean | null>(option.isSelect??null)));
    this.f.checks.valueChanges
      .subscribe((checks: (boolean | null)[] | IDynamicFieldValue[]) => {
        this.checkedOptions = this.getCheckedOptions(options, checks) as IOption[] | null;
        this.optionsInDropdown = this.optionsInDropdown?.map(option => ({ ...option, isSelect: this.checkedOptions?.some(checkedOption => checkedOption.code === option.code)}));
        const value = this.isDynamic ? this.checkedOptions?.map(option => ({value: option.code, memo: ''})) : this.getValueArray(this.checkedOptions);
        this.notifyValueChange(value);
        this.select.emit(value);
      });
  }

  protected override onModelChanged({ value, isFirstChange }: { value: (string | number)[] | null; isFirstChange: boolean; }): void { }

  /** Bug: checks 第一次值是 boolean，之後才會變成 IDynamicFieldValue  */
  private getCheckedOptions(options: IOption[], checks: (boolean | null | IDynamicFieldValue)[] ): IOption[] | null {
    const Options = checks
      .map((check, index) =>
      (((typeof check !== 'boolean' && check !== null) ? check.value : check) && options)
        ? { name: this.optionsInDropdown![index].name, code: this.optionsInDropdown![index].code }
        : null)
      .filter(name => !!name) as IOption[]
    return Options;
  }

  private getValueArray(checked: IOption[] | null): (string | number)[] | null {
    return checked ? checked.map(option => option.code) : null;
  }

  private init(): void {
    this.checkedOptions = (this.options as IOption[]).filter(option => this.model?.some(value => (this.isDynamic ? (value as IDynamicFieldValue).value : value) === option.code));
    if (this.model) {
      this.optionsInDropdown = this.optionsInDropdown?.map(option => ({ ...option, isSelect: this.checkedOptions?.some(checkedOption => checkedOption.code === option.code) }));
      this.reCreateForm(this.options as IOption[]);
    };
    this.cdr.detectChanges();
  }
}

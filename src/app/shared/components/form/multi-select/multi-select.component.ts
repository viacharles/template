import { OnChanges, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormArray, AbstractControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { OnInit, Output } from '@angular/core';
import { Component, ElementRef, Input } from '@angular/core';
import { WindowService } from '@shared/service/window.service';
import { takeUntil } from 'rxjs';
import { IOption, IOptionView } from '@utilities/interface/common.interface';
import { CustomForm, getFormProvider } from '@utilities/abstract/customForm.abstract';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [getFormProvider(MultiSelectComponent)]
})
export class MultiSelectComponent extends CustomForm<(string | number)[] | null> implements OnInit, OnChanges, AfterViewInit {
  @ViewChildren('tOptions') tOptions?: QueryList<ElementRef>
  @Input() id = '';
  @Input() options?: IOption[];
  @Input() hasFilter = false;
  @Input() isError = false;
  @Input() errorMessage?: string;
  @Input() override disabled = false;
  @Input() placeholder = '可複選';
  @Input() filterPlaceholder = '請輸入關鍵字搜尋';
  @Output() select = new EventEmitter<(string | number)[] | null>();
  get f() { return this.form.controls };

  constructor(private selfElem: ElementRef, private $window: WindowService, private fb: FormBuilder, private cdr: ChangeDetectorRef) { super() }

  public form = this.fb.group({ checks: new FormArray<AbstractControl<boolean>>([]) });
  public showDropdown = false;
  /** 選擇到的項目 */
  public checkedOptions: IOption<(string | number)>[] | null = null;
  public optionsInDropdown?: IOptionView[];

  ngOnInit(): void {
    this.$window.click$.pipe(takeUntil(this.onDestroy$))
      .subscribe(click => {
        if (!this.selfElem.nativeElement.contains(click.target)) {
          this.showDropdown = false;
        }
      });
  }

  ngOnChanges(): void {
    if (this.options) {
      this.createForm(this.options as IOption[]);
      this.optionsInDropdown = this.options.map(option => ({ ...option, ...{ show: true } }));
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
    this.checkedOptions = (this.checkedOptions as IOption[]).filter(option => option.code !== select.code);
    this.optionsInDropdown![IndexToCancel].isSelect = false;
    this.f.checks.controls[IndexToCancel].setValue(false);
    this.notifyValueChange(this.getValueArray(this.checkedOptions));
  }

  public cancelAll(event: Event): void {
    event.preventDefault();
    this.checkedOptions?.forEach(select => this.cancelSelect(select));
  }

  private createForm(options: IOption[]): void {
    options?.forEach(_ => this.f.checks.push(new FormControl()));
    this.f.checks.valueChanges
      .subscribe((checks: boolean[]) => {
        this.checkedOptions = this.getCheckedOptions(options, checks) as IOption[] | null;
        this.optionsInDropdown = this.optionsInDropdown?.map(option => ({...option, isSelect: this.checkedOptions?.some(checkedOption => checkedOption.code === option.code)}));
        this.notifyValueChange(this.getValueArray(this.checkedOptions));
        this.select.emit(this.getValueArray(this.checkedOptions));
      });
  }

  protected override onModelChanged({ value, isFirstChange }: { value: (string | number)[] | null; isFirstChange: boolean; }): void { }

  private getCheckedOptions(options: IOption[], checks: boolean[]): IOption[] | null {
    const Options = checks
      .map((check, index) =>
        (check && options) ? { name: this.optionsInDropdown![index].name, code: this.optionsInDropdown![index].code } : null)
      .filter(name => !!name) as IOption[]
    return Options;
  }

  private getValueArray(checked: IOption[] | null): (string | number)[] | null {
    return checked ? checked.map(option => option.code) : null;
  }

  private init(): void {
    this.checkedOptions = (this.options as IOption[]).filter(option => this.model?.some(value => value === option.code));
    if (this.model) {
      this.optionsInDropdown = this.optionsInDropdown?.map(option => ({...option, isSelect: this.checkedOptions?.some(checkedOption => checkedOption.code === option.code)}));
      const timer = setTimeout(() => {
        this.model?.forEach(value => (this.form.get('checks') as FormArray).at(+value - 1).setValue(true));
        clearTimeout(timer);
      });
    };
    this.cdr.detectChanges();
  }
}

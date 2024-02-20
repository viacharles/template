import { OnChanges, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { FormControl, FormArray, AbstractControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { OnInit, Output } from '@angular/core';
import { Component, ElementRef, Input } from '@angular/core';
import { WindowService } from '@shared/service/window.service';
import { takeUntil } from 'rxjs';
import { IOption, IOptionView } from '@utilities/interface/common.interface';
import { CustomForm, getFormProvider } from '@utilities/abstract/customForm.abstract';
import { ISingleDoctorSchedule } from 'src/app/modules/form/select-page/select-page.component';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [getFormProvider(MultiSelectComponent)]
})
export class MultiSelectComponent extends CustomForm<IOption[] | null> implements OnInit, OnChanges {
  @ViewChildren('tOptions') tOptions?: QueryList<ElementRef>
  @Input() id = '';
  @Input() options?: IOption[];
  @Input() hasFilter = false;
  // @Input() schedule?: ISingleDoctorSchedule;
  @Input() override disabled = false;
  @Input() placeholder = '可複選';
  @Input() filterPlaceholder = '請輸入關鍵字搜尋';
  @Output() select = new EventEmitter<IOption[] | null>();
  get f() { return this.form.controls };

  constructor(private selfElem: ElementRef, private $window: WindowService, private fb: FormBuilder) { super() }

  public form = this.fb.group({ checks: new FormArray<AbstractControl<boolean>>([]) });
  public showDropdown = false;
  /** 選擇到的項目 */
  public checkedOptions: IOption[] | null = null;
  public optionsInDropdown?: IOptionView[];

  ngOnInit(): void {
    this.$window.click$.pipe(takeUntil(this.onDestroy$))
      .subscribe(click => {
        if (!this.selfElem.nativeElement.contains(click.target)) {
          this.showDropdown = false;
        }
      });
    this.form.valueChanges.subscribe(value => console.log('aa-', value))
  }

  ngOnChanges(): void {
    if (this.options) {
      this.createForm(this.options as IOption[]);
      this.optionsInDropdown = this.options.map(option => ({ ...option, ...{ show: true } }));
    };
    // if (this.schedule) {
    //   this.schedule.assistNo.split(',').forEach((code, index) => {
    //     console.log('aa-', this.f.checks, this.f.checks.controls[index])
    //     this.f.checks.controls[index].patchValue(true);
    //   })
    // };
    // if (!this.schedule) {
    //   this.f.checks.reset();
    // };
  }

  public filter(event: Event): void {
    if (!(event instanceof KeyboardEvent) || (event.code === 'Enter' && !event.isComposing)) {
      this.optionsInDropdown =
        this.optionsInDropdown?.map(option => {
          option.show = option.nameI18n.includes((event.target as HTMLInputElement).value)
          return option;
        })
    }
  }

  public log() {console.log('aa-')}

  public cancelSelect(select: IOption): void {
    const IndexToCancel = (this.optionsInDropdown as IOption[]).findIndex(option => option.code === select.code);
    this.checkedOptions = (this.checkedOptions as IOption[]).filter(option => option.code !== select.code);
    this.f.checks.controls[IndexToCancel].setValue(false);
    this.notifyValueChange(this.checkedOptions);
  }

  public cancelAll(event: Event): void {
    event.preventDefault();
    this.checkedOptions?.forEach(select => this.cancelSelect(select));
  }

  private createForm(options: IOption[]): void {
    options?.forEach(_ => this.f.checks.push(new FormControl()));
    this.f.checks.valueChanges
      .subscribe((checks: boolean[]) => {
        console.log('aa-valueChanges', this.checkedOptions, checks)
        this.checkedOptions = this.getCheckedOptions(options, checks) as IOption[] | null;
        this.notifyValueChange(this.checkedOptions);
        this.select.emit(this.checkedOptions);
      });
  }

  protected override onModelChanged({ value, isFirstChange }: { value: IOption[] | null; isFirstChange: boolean; }): void { }

  private getCheckedOptions(options: IOption[], checks: boolean[]): IOption[] | null {
    const Options = checks
      .map((check, index) =>
        (check && options) ? { nameI18n: this.optionsInDropdown![index].nameI18n, code: this.optionsInDropdown![index].code } : null)
      .filter(name => !!name) as IOption[]
    return JSON.stringify(Options) === JSON.stringify([]) ? null : Options;
  }
}

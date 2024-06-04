import { takeUntil } from 'rxjs';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CustomForm, getFormProvider } from '@utilities/abstract/customForm.abstract';
import { ESize } from '@utilities/enum/common.enum';
import { verticalShortenOut } from '@utilities/helper/animations.helper';
import { IDynamicOption } from '@utilities/interface/form.interface';

export type IDynamicInputListForm = FormGroup<{ list: FormArray<FormGroup<{ name: FormControl<string | null>, hasMemo: FormControl<boolean | null> }>> }>;

@Component({
  selector: 'app-dynamic-input-list',
  templateUrl: './dynamic-input-list.component.html',
  styleUrl: './dynamic-input-list.component.scss',
  providers: [getFormProvider(DynamicInputListComponent)],
  animations: [verticalShortenOut()]
})
export class DynamicInputListComponent extends CustomForm implements OnChanges {
  @Input() list: IDynamicOption<string>[] = [];
  /** 隱藏 Memo 欄位*/
  @Input() hideMemo = false;
  @Output() onAddEmptyItem = new EventEmitter();

  constructor() { super() }

  private readonly listFormInit = new FormGroup({
    list: new FormArray<FormGroup<{
      name: FormControl<string | null>,
      hasMemo: FormControl<boolean | null> }>>([])
    });

  public listForm: IDynamicInputListForm = this.listFormInit;
  get sizeType() { return ESize };

  ngOnChanges({ list }: SimpleChanges): void {
    if (list && list.currentValue) {
      this.reCreateListForm(list.currentValue);
    };
  }

  public addEmptyItem(): void {
    this.listForm.controls.list.controls.push(new FormGroup({
      name: new FormControl(''),
      hasMemo: new FormControl(false)
    }));
    this.listForm.controls.list.controls[this.listForm.controls.list.controls.length - 1].valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(value => { this.listForm.controls.list.updateValueAndValidity();})
    this.listForm.controls.list.updateValueAndValidity();
    this.onAddEmptyItem.emit();
  };

  private reCreateListForm(list: IDynamicOption<string>[]): void {
    this.listForm = this.listFormInit;
    if (!!list.length) {
      list.forEach((item, index) => {
        (this.listForm.get('list') as FormArray).controls.push(new FormGroup({
          name: new FormControl(item.name),
          hasMemo: new FormControl(item.hasMemo)
          }));
          this.listForm.controls.list.controls[index].valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(value => { this.listForm.controls.list.updateValueAndValidity();})
      });
    } else {
      this.addEmptyItem();
    };
    this.listForm.controls.list.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(value => {
      const format = value.map((item) => ({ name: item.name, hasMemo: (typeof item.hasMemo === 'object' && item.hasMemo !== null) ? (item.hasMemo as unknown as {value: string, memo: string}).value : item.hasMemo }));
      this.notifyValueChange(format);
    });
    this.listForm.controls.list.updateValueAndValidity();
  }
}

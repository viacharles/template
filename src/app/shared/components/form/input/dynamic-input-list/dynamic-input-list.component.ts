import { takeUntil } from 'rxjs';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CustomForm, getFormProvider } from '@utilities/abstract/customForm.abstract';
import { ESize } from '@utilities/enum/common.enum';
import { verticalShortenOut } from '@utilities/helper/animations.helper';
import { IDynamicOption } from '@utilities/interface/form.interface';

export type IDynamicInputListForm = FormGroup<{ list: FormArray<FormGroup<{ content: FormControl<string | null>, hasMemo: FormControl<boolean | null> }>> }>;

@Component({
  selector: 'app-dynamic-input-list',
  templateUrl: './dynamic-input-list.component.html',
  styleUrl: './dynamic-input-list.component.scss',
  providers: [getFormProvider(DynamicInputListComponent)],
  animations: [verticalShortenOut()]
})
export class DynamicInputListComponent extends CustomForm implements OnInit, OnChanges {
  @Input() list: IDynamicOption<string>[] = [];
  @Output() onAddEmptyItem = new EventEmitter();

  constructor() { super() }

  private readonly listFormInit = new FormGroup({
    list: new FormArray<FormGroup<{
      content: FormControl<string | null>,
      hasMemo: FormControl<boolean | null> }>>([])
    });

  public listForm: IDynamicInputListForm = this.listFormInit;
  get sizeType() { return ESize };

  ngOnInit(): void {
    this.recCreateListForm([]);
  }

  ngOnChanges({ list }: SimpleChanges): void {
    if (list && list.currentValue) {
      this.recCreateListForm(list.currentValue);
    };
  }

  public addEmptyItem(): void {
    this.listForm.controls.list.controls.push(new FormGroup({
      content: new FormControl(''),
      hasMemo: new FormControl(false)
    }));
    this.listForm.controls.list.controls[this.listForm.controls.list.controls.length - 1].valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(value => { this.listForm.controls.list.updateValueAndValidity();})
    this.listForm.controls.list.updateValueAndValidity();
    this.onAddEmptyItem.emit();
  };

  private recCreateListForm(list: IDynamicOption<string>[]): void {
    this.listForm = this.listFormInit;
    if (!!list.length) {
      list.forEach((item, index) => {
        console.log('aa-item', item);
        (this.listForm.get('list') as FormArray).controls.push(new FormGroup({
          content: new FormControl(item.name),
          hasMemo: new FormControl(item.hasMemo)
          }));
          this.listForm.controls.list.controls[index].valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(value => { this.listForm.controls.list.updateValueAndValidity();})
      });
    } else {
      this.addEmptyItem();
    };
    this.listForm.controls.list.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(value => {
      this.notifyValueChange(value);
      console.log('aa-listForm', this.listForm.value)
    });
    this.listForm.controls.list.updateValueAndValidity();
  }
}

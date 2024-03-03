import { ToForm } from './../../../../../utilities/interface/form.interface';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Base } from '@utilities/base/base';

export type IDynamicInputListForm = FormGroup<{ list: FormArray<FormControl<string | null>> }>;

@Component({
  selector: 'app-dynamic-input-list',
  templateUrl: './dynamic-input-list.component.html',
  styleUrl: './dynamic-input-list.component.scss'
})
export class DynamicInputListComponent extends Base {
  @Input() list: string[] = [];

  public listForm: IDynamicInputListForm = new FormGroup({list: new FormArray<FormControl<string | null>>([])});

  protected override onInitBase(): void {
  }

  protected override onChangeBase({list}: SimpleChanges): void {
      if (list && list.currentValue.length > 0) {
        this.createListForm(list.currentValue);
      };
  }

  private createListForm(list: string[]): void {
    list.forEach(item => {
      (this.listForm.get('list') as FormArray).controls.push(new FormControl<string | null>(item));
    })
  }

}

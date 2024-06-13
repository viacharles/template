import { Component, Input } from '@angular/core';
import {
  IDFFormPage
} from '../../../shared/interface/dynamic-form.interface';
import { FormGroup } from '@angular/forms';
import { downFadeInAndCompressOut, fadeEnterAndHideOut, slideEnter, verticalShortenOut } from '@utilities/helper/animations.helper';
import { Base } from '@utilities/base/base';
import { DynamicForm } from '../../../shared/model/dynamic-form.model';

@Component({
  selector: 'app-dynamic-form-basic-type',
  templateUrl: './dynamic-form-basic-type.component.html',
  styleUrls: ['./dynamic-form-basic-type.component.scss'],
  animations: [fadeEnterAndHideOut(), verticalShortenOut(), downFadeInAndCompressOut(), slideEnter()],
})
export class DynamicFormBasicTypeComponent extends Base {
  @Input() model?: DynamicForm;
  @Input() pageIndex?: number;
  @Input() page?: IDFFormPage;
  @Input() form?: FormGroup;
  /** 是否有按下[完成] */
  @Input() isCompleteClicked = false;

  constructor() { super() }
}

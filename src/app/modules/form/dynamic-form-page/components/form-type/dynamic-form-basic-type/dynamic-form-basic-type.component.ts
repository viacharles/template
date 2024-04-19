import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  ICabFormPage,
  ICabQuestionView,
  ICabReviewFormOptionView,
} from '../../../shared/interface/dynamic-form.interface';
import {FormGroup} from '@angular/forms';
import {downFadeInAndCompressOut, fadeEnterAndHideOut, verticalShortenOut} from '@utilities/helper/animations.helper';
import { Base } from '@utilities/base/base';
import { OverlayService } from '@shared/service/overlay.service';
import { DynamicFieldEditDialogComponent } from '../../../shared/components/dynamic-field-edit-dialog/dynamic-field-edit-dialog.component';
import { EFieldType } from '@utilities/enum/form.enum';

@Component({
  selector: 'app-dynamic-form-basic-type',
  templateUrl: './dynamic-form-basic-type.component.html',
  styleUrls: ['./dynamic-form-basic-type.component.scss'],
  animations: [fadeEnterAndHideOut(), verticalShortenOut(), downFadeInAndCompressOut()],
})
export class DynamicFormBasicTypeComponent extends Base {
  @Input() pageIndex?: number;
  @Input() page?: ICabFormPage;
  @Input() form?: FormGroup;
  /** 是否有按下[完成] */
  @Input() isCompleteClicked = false;
  @Output() valueChange = new EventEmitter<FormGroup>();

  constructor(
    private $overlay: OverlayService
  ) { super() }

  public basicPage?: any;
  get fieldType() {return EFieldType };

  public isRequired(question: ICabQuestionView) {
    return question.SubQuestionGroup.some(answer => answer.required);
  }
  public hasMemo(SubQuestion: any) {
    return SubQuestion.options.some(
      (optionGroup: ICabReviewFormOptionView[]) => {
        return optionGroup.some(options => options.memo);
      }
    );
  }

  /** 編輯題目 */
  public editSubQuestion(SubQuestion: ICabQuestionView, index: number): void {
    this.$overlay.addDialog(
      DynamicFieldEditDialogComponent,
      SubQuestion
    )
  }

  /** 刪除題目 */
  public deleteSubQuestion(groupIndex: number, questionIndex: number): void {
    const questions = this.page?.groups[groupIndex].questions.filter((q, index) => index !== questionIndex);
    this.page!.groups[groupIndex].questions = questions ?? [];
  }

  public trim(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.trim();
  }
}

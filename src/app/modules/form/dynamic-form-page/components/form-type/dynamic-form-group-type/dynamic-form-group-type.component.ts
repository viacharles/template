import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  EFDProcess,
  EFieldStatus,
} from '@utilities/enum/common.enum';
import { downFadeInAndCompressOut, fadeEnterAndHideOut } from '@utilities/helper/animations.helper';
import { IDFRemark } from '@utilities/interface/api/df-api.interface';
import { EDFAnswerStatus } from '../../../shared/enum/df.enum';
import { IDFFormPage, IDFQuestionView, IDFReviewFormOptionView } from '../../../shared/interface/dynamic-form.interface';
import { EFieldType } from '@utilities/enum/form.enum';

@Component({
  selector: 'app-dynamic-form-group-type',
  templateUrl: './dynamic-form-group-type.component.html',
  styleUrls: ['./dynamic-form-group-type.component.scss'],
  animations: [fadeEnterAndHideOut(), downFadeInAndCompressOut()],
})
export class DynamicFormGroupTypeComponent implements OnInit {
  @Output() valueChange = new EventEmitter<FormGroup>();
  @Output() remarkValueChange = new EventEmitter<{
    remark: IDFRemark;
    questionId: string;
  }>();
  @Input() progressStatus?: EFDProcess;
  @Input() answerStatus?: EDFAnswerStatus;
  @Input() pageIndex?: number;
  @Input() page?: IDFFormPage;
  @Input() form?: FormGroup;
  /** 是否有按下[完成] */
  @Input() isCompleteClicked = false;

  constructor() {}

  get fieldStatusType() {
    return EFieldStatus;
  }
  get fieldType() {
    return EFieldType;
  }
  get progress() {
    return EFDProcess;
  }

  ngOnInit(): void {}

  public isRequired(question: IDFQuestionView) {
    return question.SubQuestionGroup.some(answer => answer.required);
  }

  public onRemarkValueChange(remarks: IDFRemark[], questionId: string): void {
    const current = remarks.find(remark => +remark.type === this.answerStatus);
    if (current) {
      this.remarkValueChange.emit({remark: current, questionId});
    }
  }

  public hasMemo(SubQuestion: any) {
    return SubQuestion.options.some(
      (optionGroup: IDFReviewFormOptionView[]) => {
        return optionGroup.some(options => options.hasMemo);
      }
    );
  }

  public trim(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.trim();
  }

  public isQuestionRequired(question: IDFQuestionView): boolean {
    return Object.values(question.SubQuestionGroup).some(SubQuestion => SubQuestion.required);
  }
}

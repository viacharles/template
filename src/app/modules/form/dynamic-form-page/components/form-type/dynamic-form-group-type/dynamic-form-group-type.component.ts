import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {
  ECabFormProcess,
  EFieldStatus,
} from '@utilities/enum/common.enum';
import {fadeEnterAndHideOut} from '@utilities/helper/animations.helper';
import {ICabRemark} from '@utilities/interface/api/cab-api.interface';
import { ECabAnswerStatus } from '../../../shared/enum/cab.enum';
import { ICabFormPage, ICabQuestionView, ICabReviewFormOptionView } from '../../../shared/interface/cab.interface';
import { EFieldType } from '@utilities/enum/form.enum';

@Component({
  selector: 'app-dynamic-form-group-type',
  templateUrl: './dynamic-form-group-type.component.html',
  styleUrls: ['./dynamic-form-group-type.component.scss'],
  animations: [fadeEnterAndHideOut()],
})
export class DynamicFormGroupTypeComponent implements OnInit {
  @Output() valueChange = new EventEmitter<FormGroup>();
  @Output() remarkValueChange = new EventEmitter<{
    remark: ICabRemark;
    questionId: string;
  }>();
  @Input() progressStatus?: ECabFormProcess;
  @Input() answerStatus?: ECabAnswerStatus;
  @Input() pageIndex?: number;
  @Input() page?: ICabFormPage;
  @Input() form?: FormGroup;
  /** 更新專案用 */
  @Input() submitBody?: any;
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
    return ECabFormProcess;
  }

  ngOnInit(): void {}
  public isRequired(question: ICabQuestionView) {
    return question.SubQuestionGroup.some(answer => answer.required);
  }

  public onRemarkValueChange(remarks: ICabRemark[], questionId: string): void {
    const current = remarks.find(remark => +remark.type === this.answerStatus);
    if (current) {
      this.remarkValueChange.emit({remark: current, questionId});
    }
  }

  public hasMemo(SubQuestion: any) {
    return SubQuestion.options.some(
      (optionGroup: ICabReviewFormOptionView[]) => {
        return optionGroup.some(options => options.memo);
      }
    );
  }

  public trim(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.trim();
  }

  public isQuestionRequired(question: ICabQuestionView): boolean {
    return Object.values(question.SubQuestionGroup).some(SubQuestion => SubQuestion.required);
  }
}

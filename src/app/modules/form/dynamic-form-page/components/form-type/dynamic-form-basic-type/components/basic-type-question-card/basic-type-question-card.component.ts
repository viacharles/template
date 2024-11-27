import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { IDFFormPage, IDFQuestionGroupView, IDFQuestionView } from 'src/app/modules/form/dynamic-form-page/shared/interface/dynamic-form.interface';
import { Base } from '@utilities/base/base';
import { OverlayService } from '@shared/service/overlay.service';
import { DynamicFieldEditDialogComponent } from 'src/app/modules/form/dynamic-form-page/shared/components/dynamic-field-edit-dialog/dynamic-field-edit-dialog.component';
import { FORM_MODE } from '@utilities/enum/common.enum';
import { IEditDynamicForm } from 'src/app/modules/form/dynamic-form-page/shared/interface/dynamic-form-form.interface';
import { EFieldType } from '@utilities/enum/form.enum';
import { IDynamicFromValidator } from '@utilities/interface/api/df-api.interface';
import { IDynamicOption } from '@utilities/interface/form.interface';
import { take, timer } from 'rxjs';
import { WarnDialogComponent } from '@shared/components/overlay/warn-dialog/warn-dialog.component';
import { DynamicForm } from 'src/app/modules/form/dynamic-form-page/shared/model/dynamic-form.model';
import { downFadeInAndCompressOut } from '@utilities/helper/animations.helper';

@Component({
  selector: 'app-basic-type-question-card',
  templateUrl: './basic-type-question-card.component.html',
  styleUrl: './basic-type-question-card.component.scss',
  animations: [downFadeInAndCompressOut()]
})
export class BasicTypeQuestionCardComponent extends Base {
  @Input() group!: IDFQuestionGroupView;
  @Input() question!: IDFQuestionView;
  @Input() groupIndex!: number;
  @Input() questionIndex!: number;
  @Input() isCompleteClicked = false;
  @Input() form?: FormGroup;
  @Input() model?: DynamicForm;
  @Input() page?: IDFFormPage;
  @Input() isError?= false;
  @Output() edit = new EventEmitter<{ question: IDFQuestionView, groupIndex: number, questionIndex: number }>();

  constructor(
    private $overlay: OverlayService,
    private self: ElementRef,
  ) { super() }

  get fieldType() { return EFieldType };

  /** 編輯題目 */
  public editSubQuestion(SubQuestion: IDFQuestionView, groupIndex: number, questionIndex: number): void {
    this.$overlay.addDialog(
      DynamicFieldEditDialogComponent,
      {
        mode: FORM_MODE.EDIT,
        question: SubQuestion
      },
      {
        callback: {
          confirm: (update: IEditDynamicForm) => {
            this.page!.groups[groupIndex]!.questions[questionIndex].show = false;
            const firstGroup = (this.form?.controls['answers'] as FormArray).controls[0] as FormGroup;
            const question = ((firstGroup.controls[SubQuestion.questionId] as FormGroup).controls['answers'] as FormGroup).controls['A'];
            const isMulti = update.fieldType === EFieldType.MultiSelect || update.fieldType === EFieldType.Checkbox;
            // 設定 validators
            const validationView = this.model?.getDynamicFromValidator(update.validation as any, !!update.required);
            if (update.validation) {
              const validators = this.model ?
                this.model.getValidations(validationView ?? [], isMulti, !!update.required) : null;
              question.setValidators(validators);
              question.setValue(isMulti ? this.model?.defaultEmpty.option : this.model?.defaultEmpty.input);
            };
            // 替換資料
            this.page!.groups[groupIndex]!.questions[questionIndex]! = {
              ...SubQuestion,
              SubQuestionGroup: [{
                ...SubQuestion.SubQuestionGroup[0],
                required: !!update.required,
                placeholder: update.placeholder ?? null,
                type: update.fieldType,
                validation: update.validation as IDynamicFromValidator[] | undefined,
                validationView: validationView,
                options: update.options?.map((v, index) => ({ label: v.name, hasMemo: v.hasMemo, value: `${index + 1}`, code: `${index + 1}`, name: v.name })) ?? null,
                optionsForNormal: update.options?.map((option, index) => ({ code: `${index + 1}`, name: option.name, hasMemo: option.hasMemo })) as IDynamicOption<string>[],
              }],
              description: update.des ?? null,
              form: (firstGroup.controls[SubQuestion.questionId] as FormGroup),
              title: update.title
            };
            timer(700).pipe(take(1)).subscribe(() => this.page!.groups[groupIndex]!.questions[questionIndex].show = true);
          }
        }
      }
    )
  }

  /** 刪除題目 */
  public deleteSubQuestion(groupIndex: number, questionIndex: number): void {
    this.$overlay.addDialog(
      WarnDialogComponent,
      {
        title: 'custom-form.question-delete-warn',
        buttons: {
          confirm: {
            bgColor: 'warn-color',
            text: 'common.delete',
          },
          cancel: {}
        }
      },
      {
        callback: {
          confirm: () => {
            const questions = this.page?.groups[groupIndex].questions.filter((q, index) => index !== questionIndex);
            this.page!.groups[groupIndex].questions = questions ?? [];
          },
          cancel: () => { },
        },
      }
    )

  }

  public trim(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.trim();
  }

  public isRequired(question: IDFQuestionView) {
    return question.SubQuestionGroup.some(answer => answer.required);
  }
}

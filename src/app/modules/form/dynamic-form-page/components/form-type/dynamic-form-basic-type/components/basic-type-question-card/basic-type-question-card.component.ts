import { Component, ElementRef, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IDFFormPage, IDFQuestionGroupView, IDFQuestionView } from 'src/app/modules/form/dynamic-form-page/shared/interface/dynamic-form.interface';
import { Base } from '@utilities/base/base';
import { OverlayService } from '@shared/service/overlay.service';
import { DynamicFieldEditDialogComponent } from 'src/app/modules/form/dynamic-form-page/shared/components/dynamic-field-edit-dialog/dynamic-field-edit-dialog.component';
import { FORM_MODE } from '@utilities/enum/common.enum';
import { IEditDynamicForm } from 'src/app/modules/form/dynamic-form-page/shared/interface/dynamic-form-form.interface';
import { EErrorMessage, EFieldType } from '@utilities/enum/form.enum';
import { IDynamicFieldValue, IDynamicFromValidator } from '@utilities/interface/api/df-api.interface';
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
  @Input() isError? = false;

  constructor(
    private $overlay: OverlayService,
    private self: ElementRef,
  ) { super() }

  private readonly defaultEmpty = {
    input: [{ value: '', memo: '' }],
    option: []
  }

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
            const validationView = this.getDynamicFromValidator(update.validation as any, !!update.required);
            if (update.validation) {
              const validators = this.model ?
              this.model.getValidations(validationView ?? [], isMulti, !!update.required) : null;
            question.setValidators(validators);
            question.setValue(isMulti ? this.defaultEmpty.option : this.defaultEmpty.input);
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

  /** 新增題目
   * @param insertFront 是否插入在前面
   */
  public addNewSubQuestion(group: IDFQuestionGroupView, SubQuestion: IDFQuestionView, questionIndex: number, insertIndex: number): void {
    this.$overlay.addDialog(
      DynamicFieldEditDialogComponent,
      {
        mode: FORM_MODE.ADD,
      },
      {
        callback: {
          confirm: (add: IEditDynamicForm) => {
            const firstGroup = (this.form?.controls['answers'] as FormArray).controls[0] as FormGroup;
            const id = Math.random().toString(36).substring(2, 32);
            const isMulti = add.fieldType === EFieldType.MultiSelect || add.fieldType === EFieldType.Checkbox;
            const validatorsView = this.getDynamicFromValidator(add.validation as any, !!add.required);
            const validators = this.model ? this.model.getValidations(validatorsView ?? [], isMulti, !!add.required) : null;
            firstGroup.addControl(
              id,
              new FormGroup({
                answers: new FormGroup({
                  A: new FormControl(isMulti ? this.defaultEmpty.option : this.defaultEmpty.input, validators)
                }),
                remark: new FormArray([])
            }));
            const questionForm = firstGroup.controls[id] as FormGroup
            const questionView: IDFQuestionView = {
              questionId: id,
              form: questionForm,
              order: insertIndex,
              // df: 0,
              show: true,
              description: add.des ?? '',
              title: add.title,
              disabled: false,
              SubQuestionGroupForm: firstGroup.controls[id] as FormGroup,
              SubQuestionGroup: [{
                answerId: 'A',
                form: (questionForm.controls['answers'] as FormGroup).controls['A'] as FormControl,
                type: add.fieldType,
                show: true,
                required: !!add.required,
                disabled: false,
                title: null,
                placeholder: add.placeholder ?? null,
                options: add.options ?? null,
                optionsForNormal: add.options?.map((option, index) => ({ code: `${index + 1}`, name: option.name, hasMemo: option.hasMemo })) as IDynamicOption<string>[],
                validationView: validatorsView,
              }]
            };

            const questionsView = group.questions;
            group.questions = [
              ...questionsView.slice(0, insertIndex),
              questionView,
              ...questionsView.slice(insertIndex)
            ];
          }
        }
      }
    );
  }


  private getDynamicFromValidator(validations: IDynamicFieldValue[], require: boolean): IDynamicFromValidator[] {
    const validation = validations.map(validation => ({
      type: validation.value as EErrorMessage,
      ...( !!validation.memo ? {value: [+validation.memo as number]} : {})
    }));
    return [...validation, ...((require && !validation.some(v=> v.type === EErrorMessage.REQUIRED)) ? [{ type: EErrorMessage.REQUIRED }] : [])];
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
          cancel: () => {},
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
